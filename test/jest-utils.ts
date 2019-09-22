export function getCallArgument<T>(jestFunction: jest.Mock<any>, call: number, argument: number): T {
  return jestFunction.mock.calls[call][argument]
}
