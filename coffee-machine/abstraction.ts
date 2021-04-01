{
	type CoffeeCup = {
		shots:number,
		hasMilk:boolean
	};

	interface CoffeeMaker {
		makeCoffee(shots: number): CoffeeCup;
	}

	interface CommercialCoffeeMaker {
		makeCoffee(shots: number): CoffeeCup;
		fillCoffeeBeans(beans: number): void;
		clean(): void;
	}

	class CoffeeMachine implements CoffeeMaker, CommercialCoffeeMaker {
		// static: class level로 한 번만 만들어짐
		private static BEANS_GRAM_PER_SHOT: number = 7;
		private coffeeBeans: number = 0;

		private constructor (coffeeBeans:number) {
			this.coffeeBeans = coffeeBeans;
		}
		static makeMachine(coffeeBeans:number):CoffeeMachine {
			return new CoffeeMachine(coffeeBeans);
		}
		fillCoffeeBeans(beans:number) {
			if (beans < 0) {
				throw new Error('value for beans should be greater than 0');
			}
			this.coffeeBeans += beans;
		}
		private grindBeans(shots: number) {
			if (this.coffeeBeans < shots * CoffeeMachine.BEANS_GRAM_PER_SHOT) {
				throw new Error('Not enough coffee beans');
			}
			this.coffeeBeans -= shots * CoffeeMachine.BEANS_GRAM_PER_SHOT;
		}
		private preheat() {
			console.log('heating up');
		}
		private extract(shots: number): CoffeeCup {
			console.log('extracting');
			return { 
				shots,
				hasMilk:false
			}
		}
		makeCoffee(shots:number): CoffeeCup {
			this.grindBeans(shots);
			this.preheat();
			return this.extract(shots);
		}
		clean() {
			console.log('cleaning the machine');
		}
	}	
	const coffeeMaker: CoffeeMaker = CoffeeMachine.makeMachine(21);
	// CoffeeMaker에 있는 makeCoffee만 사용 가능
	// coffeeMaker.fillCoffeeBeans(21);
	coffeeMaker.makeCoffee(2);
	// coffeeMaker.clean();

	const coffeeMaker2 = CoffeeMachine.makeMachine(21);
	coffeeMaker2.fillCoffeeBeans(21);
	coffeeMaker2.makeCoffee(2)
	coffeeMaker2.clean();

	class AmateurUser {
		constructor(private machine: CoffeeMaker) {}
		makeCoffee() {
			const coffee = this.machine.makeCoffee(2);
			console.log(coffee);
		}
	}

	class ProBarista {
		constructor(private machine: CommercialCoffeeMaker) {}
		makeCoffee() {
			this.machine.fillCoffeeBeans(30);
			const coffee = this.machine.makeCoffee(3)
			console.log(coffee)
			this.machine.clean()
		}
	}

	const coffeeMachine: CoffeeMachine = CoffeeMachine.makeMachine(20);
	// CoffeeMachine으로 타입을 제한했지만 생성자에서 사용 될 때 정의된 타입에 따라 유연하게 변경 가능
	const amateur = new AmateurUser(coffeeMachine);
	const pro = new ProBarista(coffeeMachine);
	console.log('--------------------------')
	amateur.makeCoffee()
	console.log('--------------------------')
	pro.makeCoffee()



}