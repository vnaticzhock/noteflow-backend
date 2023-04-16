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
Quill.register('modules/cursors', QuillCursors);

const QuillContext = createContext({
  OpenEditor: () => {},
  setIdentity: () => {},
});
const collection = 'doc-collection';
const presenceId = new ObjectID().toHexString(); // TODO

const colors = {};

const QuillProvider = (props) => {
  const [websocket, setWebsocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [editorId, setEditorId] = useState(null);
  const [editor, setEditor] = useState(null);

  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    const socket = new ReconnectingWebSocket(
      `ws://${NOTEFLOW_HOST}:${NOTEFLOW_PORT}`,
    );
    const connection = new sharedb.Connection(socket);

    setWebsocket(connection);
  }, []);

  const OpenEditor = (editorId) => {
    if (!document.getElementById('editor')) {
      throw Error('#editor not found !');
    }
    // TODO: 確認有沒有這個 collection & table 存在 mongodb 裡面
    setEditorId(editorId);
    setQuill(
      new Quill('#editor', {
        theme: 'bubble',
        modules: { cursors: true },
      }),
    );
  };

  useEffect(() => {
    if (!editorId || !quill || !websocket) return;

    const editor = websocket.get(collection, editorId);

    editor.subscribe((error) => {
      if (error) return console.error(error);

      setEditor(editor);

      quill.setContents(editor.data);
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source !== 'user') return;
        editor.submitOp(delta);
      });
      editor.on('op', function (op, source) {
        if (source) return;
        quill.updateContents(op);
      });

      const presence = editor.connection.getDocPresence(collection, editorId);
      presence.subscribe((error) => {
        if (error) throw error;
      });

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
