// 캡슗화를 통해 외부에서 접근 가능한 것과 그렇지 않은 것을 구분하여 객체가 손상되는 것을 방지

{
	type CoffeeCup = {
		shots:number,
		hasMilk:boolean
	}
	class CoffeeMaker {
		// static: class level로 한 번만 만들어짐
		private static BEANS_GRAM_PER_SHOT: number = 7;
		private coffeeBeans: number = 0;

		private constructor (coffeeBeans:number) {
			this.coffeeBeans = coffeeBeans;
		}
		static makeMachine(coffeeBeans:number):CoffeeMaker {
			return new CoffeeMaker(coffeeBeans);
		}
		fillCoffeeBeans(beans:number) {
			if (beans < 0) {
				throw new Error('value for beans should be greater than 0');
			}
			this.coffeeBeans += beans;
		}
		makeCoffee(shots:number): CoffeeCup {
			if (this.coffeeBeans < shots * CoffeeMaker.BEANS_GRAM_PER_SHOT) {
				throw new Error('Not enough coffee beans');
			}
			this.coffeeBeans -= shots * CoffeeMaker.BEANS_GRAM_PER_SHOT;
			return {
				shots,
				hasMilk: false
			}
		}
		addCoffeeBeans(coffeeBeans:number){
			this.coffeeBeans += coffeeBeans;
		}
	}	
	const coffeeMaker = CoffeeMaker.makeMachine(21);
	console.log(coffeeMaker);
	coffeeMaker.fillCoffeeBeans(40);
	console.log(coffeeMaker);

	console.log(CoffeeMaker.makeMachine(32));
	const coffee: CoffeeCup = coffeeMaker.makeCoffee(3);
	console.log('coffee', coffee);

	// Getter, Setter 외부에서 값 변경시 객체 내부에 정의된 유효성 체크가 가능하고 
	// Getter를 통해 Vue의 computed 속성과 비슷한 효과를 얻을 수 있다

	class User {
		private internalAge = 4;
		constructor(private firstName: string, private lastName: string){}
		get fullName(): string {
			return `${this.firstName} ${this.lastName}`;
		}
		get age(): number {
			return this.internalAge;
		}
		set age(num: number){
			this.internalAge = num;
		}
	}

	const user = new User('Sungsu', ',Choi');
	user.age = 5;
	console.log(user)
}