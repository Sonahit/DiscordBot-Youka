import { ColorResolvable } from "discord.js";

export default interface User {
  id: string,
  username: string,
  title?: string,
  avatar: string,
  description: string,
  color: ColorResolvable,
  footerDescription?: string,
  footerIcon?: string,
}
