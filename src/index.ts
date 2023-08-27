const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
	List = "list",
	Add = "add",
	Remove = "remove",
	Quit = "quit"
}

enum MessageVariant {
	Success = "success",
	Error = "error",
	Info = "info"
}

type InquirerAnswers = {
	action: Action
}

const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?'
  }]).then(async (answers: InquirerAnswers) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name'
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age'
        }]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name'
        }]);
        users.remove(name.name);
        break;
      case Action.Quit:
        Message.showColorized(MessageVariant.Info, "Goodbye.");
        return;
    }
  });
}

startApp();

class Message {
	constructor(private content: string) {
		this.content = content;
	}
	public show() {
		console.log(this.content);
	}
	capitalize() {
		this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase();
	}
  toUpperCase() {
		this.content = this.content.toUpperCase();
	}
	toLowerCase() {
		this.content = this.content.toLowerCase();
	}
	public static showColorized(variant: MessageVariant, text: string): void {
    if(variant === MessageVariant.Success) {
      consola.success(text);
    } else if(variant === MessageVariant.Error) {
      consola.error(text);
    } else if(variant === MessageVariant.Info) {
      consola.info(text);
    } else {
      consola.info(text);
    }
  }
}

function measurePerformance(target: any, name: string, descriptor: any) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const finish = performance.now();
    console.info(`${name} execution time is ${finish - start} milliseconds`);
    return result;
  }
}
interface User {
	name: string,
	age: number
}

class UsersData {
	private data: User[] = [];

  @measurePerformance
	showAll() {
    Message.showColorized(MessageVariant.Info, 'Users data');
    if(this.data.length > 0) {
      console.table(this.data);
    } else {
      Message.showColorized(MessageVariant.Error, 'No data.');
    }
  }

  @measurePerformance
	public add(user: User) {
		if(user.age > 0 && user.name.length > 0) {
			this.data.push(user);
			Message.showColorized(MessageVariant.Success, 'User created.');
		} else {
			Message.showColorized(MessageVariant.Error, 'Incorrect data.');
		}
	}

	public remove(name: string) {
		const index = this.data.findIndex(user => user.name === name);
		if(index !== -1) {
			this.data.splice(index, 1);
			Message.showColorized(MessageVariant.Success, 'User deleted/');
		} else {
			Message.showColorized(MessageVariant.Error, 'User not found.');
		}
	}
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list - show all users");
console.log("add - add new user to the list");
console.log("remove - remove user from the list");
console.log("quit - quit the app");
console.log("\n");

// const msg = new Message("heLlo world!");
// msg.show(); // "heLlo world!"
// msg.capitalize();
// msg.show(); // "Hello world!"
// msg.toLowerCase();
// msg.show(); // "hello world!"
// msg.toUpperCase();
// msg.show(); // "HELLO WORLD!"
// Message.showColorized(MessageVariant.Success, "Test"); // √ "Test"
// Message.showColorized(MessageVariant.Error, "Test 2"); // "x Test 2"
// Message.showColorized(MessageVariant.Info, "Test 3"); // ℹ "Test 3"

// const users = new UsersData();
// users.showAll();
// users.add({name: "Jan", age: 20});
// users.add({name: "Adam", age: 30});
// users.add({name: "Kasia", age: 23});
// users.add({name: "Basia", age: -6});
// users.showAll();
// users.remove("Maurycy");
// users.remove("Adam");
// users.showAll();