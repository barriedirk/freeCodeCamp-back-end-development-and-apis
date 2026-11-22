export const ROLES = {
  CHILD: 'child',
  PARENT: 'parent'
}

export function authorizeModification(req, res, next) {
  const { userId } = req.params;
  const { role, id } = req.user ?? {};

  const isParent = role === ROLES.PARENT;
  const isOwnChild = role === ROLES.CHILD && String(userId) === String(id);

  if (!isParent && !isOwnChild) {
    return res.status(403).json({
      error: 'Access denied'
    });
  }

  next();
};
