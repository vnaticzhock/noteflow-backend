import React, { createContext, useContext, useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import sharedb from "sharedb/lib/client";
import NodeRef from "./FlowRef";

let { NOTEFLOW_HOST = "localhost", NOTEFLOW_PORT = "8099" } = process.env;

const FlowContext = createContext({
  flow: {},
  openFlow: () => {},
  editComponent: () => {
    return true;
  },
  addComponent: () => {},
  removeComponent: () => {},
});

const collection = "flows";

const FlowProvider = (props) => {
  const [websocket, setWebsocket] = useState(null);
  const [flowId, setFlowId] = useState(null);
  const [flow, setFlow] = useState(null);
  const [controller, setController] = useState(null);

  useEffect(() => {
    const socket = new ReconnectingWebSocket(
      `ws://${NOTEFLOW_HOST}:${NOTEFLOW_PORT}`
    );

    const connection = new sharedb.Connection(socket);

    setWebsocket(connection);
  }, []);

  const openFlow = async (flowId) => {
    if (controller) {
      await controller.unsubscribe();
    }
    setFlowId(flowId);
  };

  useEffect(() => {
    if (!flowId || !websocket) return;

    const flow = websocket.get(collection, flowId);

    flow.subscribe((error) => {
      if (error) return console.error(error);

      setFlow(flow.data);
      setController(flow); // 這個會一直拿到最新資料哦！

      // op: by this client or by any other peer or server.
      flow.on("op", (op, source) => {
        console.log("TODO:", source);
        setFlow(flow.data);
      });
    });
  }, [flowId, websocket]);

  const editComponent = (type, componentId, delta) => {
    if (!(type in ["nodeRefs", "edges", "name"])) {
      throw Error(`${type} cannot be changed or currently not supported.`);
    }
    if (type === "name") {
      controller.submitOp([type, { r: true }, { i: delta }]);
      return;
    }
    const predicate = type === "edges" ? "edgeId" : "nodeId";
    let index;
    for (let i = 0; i < flow[type].length; i++) {
      if (flow[i][predicate] === componentId) {
        index = i;
        break;
      }
    }
    controller.submitOp([type, index, { r: true }, { i: delta }]);
  };

  const addComponent = (type, options = {}) => {
    if (!(type in ["nodeRefs", "edges"])) {
      throw Error("");
    }
    if (type === "edges") {
    } else {
      // nodeRef 分成新 node 或是 library Node
      if (options.nodeId) {
        // 舊 node
        controller.submitOp([
          "nodeRefs",
          0,
          { ...new NodeRef(options.nodeId) },
        ]);
      } else {
        // 新 node
        const nodeId = addNode(); // addNode()
        controller.submitOp(["nodeRefs", 0, { ...new NodeRef(nodeId) }]);
      }
    }
  };

  const addNode = () => {
    return "0";
  };

  const removeComponent = (type, componentId, delta) => {
    if (!(type in ["nodeRefs", "edges"])) {
      throw Error("");
    }
    const predicate = type === "edges" ? "edgeId" : "nodeId";
    let index;
    for (let i = 0; i < flow[type].length; i++) {
      if (flow[i][predicate] === componentId) {
        index = i;
        break;
      }
    }
    controller.submitOp([type, index, { r: true }]);
  };

  return (
    <FlowContext.Provider
      value={{ flow, openFlow, editComponent, addComponent, removeComponent }}
      {...props}
    />
  );
};

const useFlow = () => useContext(FlowContext);

export { FlowProvider, useFlow };
