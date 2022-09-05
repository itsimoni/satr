let x = 312390

class DivisionAlgo {
	divide(n, k) {
		let value = 0;
		while (n > 0) {
			n -= k;
			value++;
		}
		if (n < 0) {
			value--;
		}
		return value;
	}
	modulus(n, k) {
		while (n > 0) {
			n -= k;
		}
		n = k + n;
		return n;
	}
}

let div = new DivisionAlgo;
let initialValue = 2;
let result2 = div.divide(x, 1440)
console.log(result2,(x % 1440));
console.log(Date.now() - 1440)

var a = new Date();
a.setHours(0,0,0,0); // last midnight

console.log(a.getTime());