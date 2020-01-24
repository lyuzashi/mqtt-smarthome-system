const vm = require('vm');

function aggregate() {
  if (brightness > 0 && on === true) {
    targetValue = brightness;
  }

  if (on === false) {
    targetValue = 0;
  }
}


function run(fn) {

  const context = vm.createContext(new Proxy({
    console,
  }, {
    get(target, property, receiver) {
      if (!Reflect.has(target, property)) {
        return Math.random();
      }
      return Reflect.get(target, property, receiver)
    }
  }));

  const script = new vm.Script(fn.toString());
  
  console.log('running', aggregate.name)

  script.runInContext(context);
  new vm.Script(`aggregate()`).runInContext(context);

}


run(aggregate);
