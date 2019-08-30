export function feed(parent, { filter, skip, first, orderBy }, context) {
  const where = filter
    ? {
        OR: [{ description_contains: filter }, { url_contains: filter }]
      }
    : {};

  const links = context.prisma.links({
    where,
    skip,
    first,
    orderBy
  });

  const count = context.prisma
    .linksConnection({
      where
    })
    .aggregate()
    .count();

  return {
    links,
    count
  };
}

export function link(parent, { id }, context) {
  return context.prisma.link({ id });
}

export function users(parent, args, context) {
  return context.prisma.users();
}
