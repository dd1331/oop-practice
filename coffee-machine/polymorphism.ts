{
	type CoffeeCup = {
		shots:number,
		hasMilk?:boolean,
		hasSugar?:boolean
	};

	interface CoffeeMaker {
		makeCoffee(shots: number): CoffeeCup;
	}

	class CoffeeMachine implements CoffeeMaker {
		// static: class level로 한 번만 만들어짐
		private static BEANS_GRAM_PER_SHOT: number = 7;
		private coffeeBeans: number = 0;

		public constructor (coffeeBeans:number) {
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

	class CaffeLatteMachine extends CoffeeMachine {
		constructor(beans: number, public readonly serialNumber: string) {
			// 자식에서 생성자 호출하는 경우는 부모의 생성자도 동시에 호출해야함
			super(beans);
		}
		private steamMilk(): void {
			console.log('steam milk');
		}
		makeCoffee(shots: number): CoffeeCup {
			// super를 통해 오버라이딩과 관계 없이 부모의 생성자 호출 가능
			const coffee = super.makeCoffee(shots)
			this.steamMilk()
			return {
				...coffee,
				hasMilk: true
			}
		}
	}

	class SweetCoffeeMaker extends CoffeeMachine {
		makeCoffee(shots: number): CoffeeCup {
			const coffee = super.makeCoffee(shots);
			return {
				...coffee,
				hasSugar: true
			}
		}
	}	
	
	const machines: CoffeeMaker[] = [
		new CoffeeMachine(32),
		new CaffeLatteMachine(32, 'ests'),
		new SweetCoffeeMaker(32),
		new CoffeeMachine(32),
		new CaffeLatteMachine(32, 'ests'),
		new SweetCoffeeMaker(32)
	]
	// 상속을 통해 공통함수를 호출할 수 있음
	machines.forEach(machine => {
		console.log('------------------------');
		machine.makeCoffee(3);
	})
}