import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function CardAvatar({
  avatarUrl,
  name,
  email,
  hoverCard,
}: {
  avatarUrl?: string
  name: string
  email: string
  hoverCard: boolean
}) {
  return (
    <HoverCard>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt="Profile image" />
          <AvatarFallback>
            {name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start space-y-0.5">
          <HoverCardTrigger asChild>
            <p>
              <a className="text-sm font-medium hover:underline" href="#">
                {name}
              </a>
            </p>
          </HoverCardTrigger>
          <p className="text-muted-foreground text-xs">{email}</p>
        </div>
      </div>
      {hoverCard && (
        <HoverCardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={avatarUrl} alt="Profile image" />
                <AvatarFallback>
                  {name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-muted-foreground text-xs">{email}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Developer at{' '}
              <strong className="text-foreground font-medium">
                @Origin UI
              </strong>
              . Crafting web experiences with Tailwind CSS.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <img
                  className="ring-background rounded-full ring-1"
                  src={avatarUrl}
                  width={20}
                  height={20}
                  alt="Friend 01"
                />
                <img
                  className="ring-background rounded-full ring-1"
                  src={avatarUrl}
                  width={20}
                  height={20}
                  alt="Friend 02"
                />
                <img
                  className="ring-background rounded-full ring-1"
                  src={avatarUrl}
                  width={20}
                  height={20}
                  alt="Friend 03"
                />
              </div>
              <div className="text-muted-foreground text-xs">
                3 mutual friends
              </div>
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  )
}
