// Composition
// 과도한 상속으로 인한 복잡성이 발생하는 것을 피하면서 확장 가능한 형태로 만들기 위해 의존성을 주입한다
// 과도한 결합 발생하나 인터페이스로 개선 가능

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
	class NormalMilkSteamer {
		private steamMilk(): void {
			console.log('Steam milk');
		}
		makeMilk(cup: CoffeeCup): CoffeeCup {
			this.steamMilk();
			return {
				...cup,
				hasMilk: true
			}
		}
	}
	class SugarMixer {
		private getSugar() {
			console.log('get Sugar');
		}
		addSugar(cup: CoffeeCup): CoffeeCup {
			this.getSugar();
			return {
				...cup,
				hasSugar: true
			}
		}
	}
	class CaffeLatteMachine extends CoffeeMachine {
		constructor(beans: number, public readonly serialNumber: string, private milkSteamer: NormalMilkSteamer) {
			super(beans);
		}
		makeCoffee(shots: number): CoffeeCup {
			const coffee = super.makeCoffee(shots);
			return this.milkSteamer.makeMilk(coffee);
		}
	}

	class SweetCoffeeMaker extends CoffeeMachine {
		constructor(private beans: number, private sugarMixer: SugarMixer) {
			super(beans);
		}
		makeCoffee(shots: number): CoffeeCup {
			const coffee = super.makeCoffee(shots);
			// DI를 통해 외부에서 주입
			return this.sugarMixer.addSugar(coffee);
		}
	}

	class SweetCaffeLatteMachine extends CoffeeMachine {
		constructor(beans: number, private milkSteamer: NormalMilkSteamer, private sugarMixer: SugarMixer) {
			super(beans);
		}
		makeCoffee(shots: number) {
			const coffee = super.makeCoffee(shots);
			const sugarAdded = this.sugarMixer.addSugar(coffee);
			return this.milkSteamer.makeMilk(sugarAdded);
		}
	}
}