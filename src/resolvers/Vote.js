export function link(parent, args, context) {
  return context.prisma.vote({ id: parent.id }).link();
}

export function user(parent, args, context) {
  return context.prisma.vote({ id: parent.id }).user();
}
