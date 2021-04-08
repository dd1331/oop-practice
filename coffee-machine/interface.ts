

{
	type CoffeeCup = {
		shots:number,
		hasMilk?:boolean,
		hasSugar?:boolean
	};

	interface CoffeeMaker {
		makeCoffee(shots: number): CoffeeCup;
	}
	interface MilkSteamer {
		makeMilk(cup: CoffeeCup): CoffeeCup;
	}
	interface SugarMixer {
		addSugar(cup: CoffeeCup): CoffeeCup;
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
	class NormalMilkSteamer implements MilkSteamer {
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
	class FancyMilkSteamer implements MilkSteamer {
				private steamMilk(): void {
					console.log('Fancy steam milk');
				}
				makeMilk(cup: CoffeeCup): CoffeeCup {
					this.steamMilk();
					return {
						...cup,
						hasMilk: true
					}
				}
	}
	class ColdMilkSteamer implements MilkSteamer {
				private steamMilk(): void {
					console.log('Cold steam milk');
				}
				makeMilk(cup: CoffeeCup): CoffeeCup {
					this.steamMilk();
					return {
						...cup,
						hasMilk: true
					}
				}
	}
	class NoMilk implements MilkSteamer {
		makeMilk(cup: CoffeeCup): CoffeeCup {
			return cup;
		}
	}
	class NormalSugarMixer implements SugarMixer {
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
	class FancySugarMixer implements SugarMixer {
		private getSugar() {
			console.log('get fancy sugar');
		}
		addSugar(cup: CoffeeCup): CoffeeCup {
			this.getSugar();
			return {
				...cup,
				hasSugar: true
			}
		}
	}
	class NoSugar implements SugarMixer {
		addSugar(cup: CoffeeCup): CoffeeCup {
			return cup;
		}
	}

	class CaffeLatteMachine extends CoffeeMachine {
		constructor(beans: number, public readonly serialNumber: string, private milkSteamer: MilkSteamer) {
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
		constructor(beans: number, private milkSteamer: MilkSteamer, private sugarMixer: SugarMixer) {
			super(beans);
		}
		makeCoffee(shots: number) {
			const coffee = super.makeCoffee(shots);
			const sugarAdded = this.sugarMixer.addSugar(coffee);
			return this.milkSteamer.makeMilk(sugarAdded);
		}
	}


	class NewCoffeeMachine implements CoffeeMaker {
		private static BEANS_GRAM_PER_SHOT: number = 7;
		// private coffeeBeans: number = 0;

		public constructor (
			private coffeeBeans:number = 0, 
			private sugarMixer: SugarMixer,
			private milkSteamer: MilkSteamer) {
			// this.coffeeBeans = coffeeBeans;
		}
		fillCoffeeBeans(beans:number) {
			if (beans < 0) {
				throw new Error('value for beans should be greater than 0');
			}
			this.coffeeBeans += beans;
		}
		private grindBeans(shots: number) {
			if (this.coffeeBeans < shots * NewCoffeeMachine.BEANS_GRAM_PER_SHOT) {
				throw new Error('Not enough coffee beans');
			}
			this.coffeeBeans -= shots * NewCoffeeMachine.BEANS_GRAM_PER_SHOT;
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
			const coffe = this.extract(shots);
			const sugarAdded = this.sugarMixer.addSugar(coffe)
			this.milkSteamer.makeMilk(sugarAdded )
			return this.extract(shots);
		}
		clean() {
			console.log('cleaning the machine');
		}
	}	
	// composition만을 이용한 경우 명시된 객체만 주입가능 하므로 재사용성이 떨어짐.

	// const normalMilkMaker = new NormalMilkSteamer();
	// const normalSugarMixer = new NormalSugarMixer();
	// const sweetMachine = new SweetCoffeeMaker(12, normalSugarMixer);
	// const letterMachine = new CaffeLatteMachine(12, 'ss', normalMilkMaker)
	// const sweetLatterMachine = new SweetCaffeLatteMachine(12, normalMilkMaker, normalSugarMixer)
	

	
	const normalMilkMaker = new NormalMilkSteamer();
	const fancyMilkMaker = new FancyMilkSteamer();
	const coldMilkMaker = new ColdMilkSteamer();
	const noMilk = new NoMilk();
	
	const normalSugarMixer = new NormalSugarMixer();
	const fancySugarMixer = new FancySugarMixer();
	const noSugar = new NoSugar();
	
	// 생성자에 주입되는 인자?의 타입을 인터페이스로 지정하여 다양한 형태의 객체 주입 가능
	
	// const normalSweetMachine = new SweetCoffeeMaker(12, normalSugarMixer)
	// const fancySweetMachine = new SweetCoffeeMaker(12, fancySugarMixer)
	
	// const normalLatterMachine = new CaffeLatteMachine(12, 'ss,', normalMilkMaker)
	// const fancyLatterMachine = new CaffeLatteMachine(12, 'ss,', fancyMilkMaker)
	// const coldLatterMachine = new CaffeLatteMachine(12, 'ss,', coldMilkMaker)
	
	
	// 인터페이스를 통한 다양한 형태의 객체가 주입 가능하므로 하나의 클래스로 여러 형태의 인스턴스를 구현할 수 있다
	const normalLatterMachine = new NewCoffeeMachine(12, noSugar, normalMilkMaker);
	const fancyLatterMachine = new NewCoffeeMachine(12, noSugar, fancyMilkMaker);
	const coldLatterMachine = new NewCoffeeMachine(12, noSugar, coldMilkMaker);
	
	const normalSweetMachine = new NewCoffeeMachine(12, normalSugarMixer, noMilk);
	const fancySweetMachine = new NewCoffeeMachine(12, fancySugarMixer, noMilk)
}