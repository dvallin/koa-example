export function getCallArgument<T>(jestFunction: jest.Mock<any, any>, call: number, argument: number): T {
  return jestFunction.mock.calls[call][argument]
}
