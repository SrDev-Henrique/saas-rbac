import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

export default function AvatarGroup({
  avatarUrls,
  names,
}: {
  avatarUrls: string[]
  names: string[]
}) {
  return (
    <div className="bg-background flex items-center rounded-full border p-1 shadow-md">
      <div className="flex -space-x-3">
        {avatarUrls.slice(0, 4).map((avatarUrl, index) => (
          <div key={avatarUrl}>
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {names[index]?.charAt(0).toUpperCase() +
                  names[index]?.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>
      {avatarUrls.length > 4 && (
        <Button
          variant="secondary"
          className="text-muted-foreground hover:text-foreground flex items-center justify-center rounded-full bg-transparent px-3 text-xs shadow-none hover:bg-transparent"
        >
          +{avatarUrls.length - 4}
        </Button>
      )}
    </div>
  )
}
