export default payload => {
  if ('object' === typeof payload && payload.type) {
    switch (payload.type) {
      case 'Buffer':
        return Buffer.from(payload.data);
    }
  }
  return payload;
}