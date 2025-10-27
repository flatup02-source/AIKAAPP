exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: `Hello from Netlify Function! Your path: ${event.path}`,
  };
};