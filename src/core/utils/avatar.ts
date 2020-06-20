export default (userId: string, avatarId: any) => {
  if(!avatarId) {
    return "";
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}`;
}
