export const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    config: {
      autoIndex: false,
    },
    promiseLibrary: global.Promise,
  };
