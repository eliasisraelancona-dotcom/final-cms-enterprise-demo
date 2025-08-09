/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@keystone-ui/core'
import { NavigationContainer, ListNavItems, NavItem } from '@keystone-6/core/admin-ui/components'
import type { NavigationProps } from '@keystone-6/core/admin-ui/components'

export function CustomNavigation({ authenticatedItem, lists }: NavigationProps) {
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } catch {}
    window.location.assign('/signin')
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

