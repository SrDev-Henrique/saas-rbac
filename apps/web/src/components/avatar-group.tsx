import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { cn } from '@/lib/utils'

export default function AvatarGroup({
  avatarUrls,
  names,
  size = 'default',
  shadow = true,
}: {
  avatarUrls: string[]
  names?: string[] | null
  size?: 'default' | 'sm'
  shadow?: boolean
}) {
  return (
    <div
      className={cn(
        'bg-background flex items-center rounded-full border p-1',
        shadow && 'shadow-md',
      )}
    >
      <div className="flex -space-x-2">
        {avatarUrls.slice(0, 4).map((avatarUrl, index) => (
          <div key={avatarUrl}>
            <Avatar className={size === 'sm' ? 'size-6' : 'size-8'}>
              <AvatarImage src={avatarUrl} />
              {names ? (
                <AvatarFallback>
                  {names?.[index]?.charAt(0).toUpperCase() +
                    names?.[index]?.charAt(1).toUpperCase()}
                </AvatarFallback>
              ) : (
                <AvatarFallback />
              )}
            </Avatar>
          </div>
        ))}
      </div>
      {avatarUrls.length > 4 && (
        <Button
          variant="secondary"
          className={cn(
            'text-muted-foreground hover:text-foreground flex items-center justify-center rounded-full bg-transparent px-3 text-xs shadow-none hover:bg-transparent',
            size === 'sm' ? 'px-2 text-xs size-5' : 'px-3 text-xs',
          )}
        >
          +{avatarUrls.length - 4}
        </Button>
      )}
    </div>
  )
}
