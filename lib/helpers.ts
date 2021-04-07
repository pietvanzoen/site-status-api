export function flow(funcs: Array<(input: any) => any>): (input: any) => any {
  return (input: any) => funcs.reduce((result, func) => func(result), input);
}
