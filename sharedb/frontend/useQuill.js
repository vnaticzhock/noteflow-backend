import React, { createContext, useContext, useEffect, useState } from 'react';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import ObjectID from 'bson-objectid';
import tinycolor from 'tinycolor2';
import ReconnectingWebSocket from 'reconnecting-websocket';
import sharedb from 'sharedb/lib/client';
import richText from 'rich-text';

// dotenv.config();

let { NOTEFLOW_HOST = '140.112.107.71', NOTEFLOW_PORT = '3000' } = process.env;

sharedb.types.register(richText.type);

const QuillContext = createContext({
  OpenEditor: () => {},
  setIdentity: () => {},
});

/**
 * Quill 介面，可以自行修改裡面的元素
 */
Quill.register('modules/cursors', QuillCursors);
const quillInterface = new Quill('#editor', {
  theme: 'bubble',
  modules: { cursors: true },
});

const collection = 'editors';

/**
 * 亂數產生的 hashId, 這個 id 可以再綁定一個名字，
 * 可以使用 setIdentity({..., name: ...}) 來綁定名字。
 */
const presenceId = new ObjectID().toHexString(); // TODO

/**
 * 自動為不同人的 Cursors 產生不同顏色並渲染
 * {
 *  hashId1: '#......',
 *  hashId2: '#......',
 * }
 */
const colors = {};

const QuillProvider = (props) => {
  const [websocket, setWebsocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [editorId, setEditorId] = useState(null);
  const [editor, setEditor] = useState(null);
  const [presence, setPresence] = useState(null);

  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    const socket = new ReconnectingWebSocket(
      `ws://${NOTEFLOW_HOST}:${NOTEFLOW_PORT}`,
    );
    const connection = new sharedb.Connection(socket);

    setWebsocket(connection);
  }, []);

  const OpenEditor = async (editorId) => {
    if (!document.getElementById('editor')) {
      throw Error('#editor not found !');
    }
    // TODO: 確認有沒有這個 collection & table 存在 mongodb 裡面
    if (editor) {
      // 如果先前有訂閱其他的 Node，取消訂閱，清除 eventListener
      await editor.unsubscribe();
    }
    if (presence) {
      await presence.unsubscribe();
    }
    setEditorId(editorId);
    setQuill(quillInterface);
  };

  useEffect(() => {
    if (!editorId || !quill || !websocket) return;

    const editor = websocket.get(collection, editorId);

    editor.subscribe((error) => {
      if (error) return console.error(error);

      // 設定特定 node editor 的 websocket
      setEditor(editor);

      quill.setContents(editor.data);

      // 如果你改變文字
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source !== 'user') return; // ?
        editor.submitOp(delta);
      });

      // 如果你收到從別的地方來的訊息
      editor.on('op', function (op, source) {
        if (source) return;
        quill.updateContents(op);
      });

      // 進入
      const presence = editor.connection.getDocPresence(collection, editorId);
      presence.subscribe((error) => {
        if (error) throw error;
      });
      setPresence(presence);

      const localPresence = presence.create(presenceId);

      quill.on('selection-change', (range, oldRange, source) => {
        if (source !== 'user') return;
        if (!range) return;

        range.name = identity ? (identity.name ? identity.name : '-') : '-'; // # TODO
        localPresence.submit(range, (error) => {
          if (error) throw error;
        });
      });

      const cursors = quill.getModule('cursors');

      presence.on('receive', function (id, range) {
        colors[id] = colors[id] || tinycolor.random().toHexString();
        var name = (range && range.name) || 'Anonymous';
        cursors.createCursor(id, name, colors[id]);
        cursors.moveCursor(id, range);
      });
    });

    setEditor(editor);
  }, [editorId, quill, websocket, identity]);

  return (
    <QuillContext.Provider value={{ OpenEditor, setIdentity }} {...props} />
  );
};

const useQuill = () => useContext(QuillContext);

export { QuillProvider, useQuill };
