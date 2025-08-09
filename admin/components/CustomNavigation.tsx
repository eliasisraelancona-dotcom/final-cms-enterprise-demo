/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@keystone-ui/core'
import { NavigationContainer, ListNavItems, NavItem } from '@keystone-6/core/admin-ui/components'
import type { NavigationProps } from '@keystone-6/core/admin-ui/components'
import { useKeystone } from '@keystone-6/core/admin-ui/context'

export function CustomNavigation({ authenticatedItem, lists }: NavigationProps) {
  const keystone = (useKeystone() as unknown) as { endSession?: () => Promise<void> }
  const handleSignOut = async () => {
    try {
      if (keystone?.endSession) {
        await keystone.endSession()
      } else {
        await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: 'mutation { unauthenticate: unauthenticateUser { success } }' }),
          credentials: 'include',
        })
      }
    } catch {}
    window.location.replace('/signin')
  }

  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div>
          <NavItem href="/">Dashboard</NavItem>
          <ListNavItems lists={lists} />
        </div>
        <div
          css={{
            marginTop: 'auto',
            padding: 12,
          }}
        >
          <button onClick={handleSignOut} aria-label="Sign out">
            Sign out
          </button>
        </div>
      </div>
    </NavigationContainer>
  )
}

