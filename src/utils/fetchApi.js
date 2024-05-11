export const getFetchAuth = async (endpoint, payload) => {
  return await fetch(`http://localhost:3001/v1/api/${endpoint}`, payload);
};

export const getFetchPost = async (endpoint, payload) => {
    return await fetch(`http://localhost:3002/v1/api/${endpoint}`, payload);
  };
  