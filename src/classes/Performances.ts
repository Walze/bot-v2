import { performance } from "perf_hooks";

export class Performance {
  constructor(
    public name: string,
    public t0: number
  ) { }

  reset() {
    this.t0 = performance.now()
  }

  done() {
    const diff = Math.round((performance.now() - this.t0) * 1e2) / 1e2
    const string = `\n${this.name} was done in ${diff} ms\n`

    console.log(string)

    return string
  }
}

export class Performances {
  static tests: Performance[] = []

  static test(name: string) {
    const found = this.find(name)

    if (!found) {
      const newTest = new Performance(name, performance.now());
      this.tests.push(newTest)
      return newTest
    }

    found.reset()
    return found
  }

  static find(name: string): Performance | void {
    const test = this.tests.find(test => test.name == name)

    if (test) return test
  }
}