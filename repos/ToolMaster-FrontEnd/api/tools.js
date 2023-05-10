import client from './client';

const endpoint = '/tools';

const addTool = (tool, onUploadProgress) => {
  return client.post(endpoint, tool, {
    onUploadProgress: (progress) => {
      onUploadProgress(progress.loaded / progress.total);
    },
  });
};

const getTools = () => {
  return client.get(endpoint);
};

const getToolById = (tool) => {
  return client.get(endpoint + '/' + tool._id);
};

const updateTool = (tool, onUploadProgress) => {
  const updatedTool = {
    name: tool.name,
    serieNumber: tool.serieNumber,
    toolGroup: tool.toolGroup,
  };

  return client.put(endpoint + '/' + tool._id, updatedTool, {
    onUploadProgress: (progress) => {
      onUploadProgress(progress.loaded / progress.total);
    },
  });
};

const updateStatus = (tool) => {
  const updatedTool = {
    name: tool.name,
    serieNumber: tool.serieNumber,
    toolGroup: tool.toolGroup._id,
    project: tool.project._id,
  };

  updatedTool.available = true;

  return client.put(endpoint + '/' + tool._id, updatedTool);
};

const deleteTool = (tool, onUploadProgress) => {
  return client.delete(endpoint + '/' + tool._id, {
    onUploadProgress: (progress) => {
      onUploadProgress(progress.loaded / progress.total);
    },
  });
};

const dispatchTool = (tool) => {
  const updatedTool = {
    name: tool.name,
    serieNumber: tool.serieNumber,
    toolGroup: tool.toolGroup._id,
    project: tool.project,
  };

  return client.put(endpoint + '/' + tool._id, updatedTool);
};

export default {
  addTool,
  getTools,
  getToolById,
  updateStatus,
  updateTool,
  deleteTool,
  dispatchTool,
};
