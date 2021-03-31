{
	type CoffeeCup = {
		shots:number,
		hasMilk:boolean
	}
	class CoffeeMaker {
		// static: class level로 한 번만 만들어짐
		static BEANS_GRAM_PER_SHOT: number = 7;
		private coffeeBeans: number = 0;

		constructor (coffeeBeans:number) {
			this.coffeeBeans = coffeeBeans
		}
		static makeMachine(coffeeBeans:number):CoffeeMaker {
			return new CoffeeMaker(coffeeBeans)
		}
		makeCoffee(shots:number): CoffeeCup {
			if (this.coffeeBeans < shots * CoffeeMaker.BEANS_GRAM_PER_SHOT) {
				throw new Error('Not enough coffee beans')
			}
			this.coffeeBeans -= shots * CoffeeMaker.BEANS_GRAM_PER_SHOT
			return {
				shots,
				hasMilk: false
			}
		}
		addCoffeeBeans(coffeeBeans:number){
			this.coffeeBeans += coffeeBeans;
		}
	}	
	const coffeeMaker = new CoffeeMaker(21);
	// coffeeMaker.addCoffeeBeans(21);
	console.log(coffeeMaker)
	console.log(CoffeeMaker.makeMachine(32))
	const coffee: CoffeeCup = coffeeMaker.makeCoffee(3);
	console.log('coffee', coffee)
}