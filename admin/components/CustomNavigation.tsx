/** @jsxRuntime classic */
import { jsx } from '@keystone-ui/core'
import { NavigationContainer, ListNavItems, NavItem } from '@keystone-6/core/admin-ui/components'
import type { NavigationProps } from '@keystone-6/core/admin-ui/components'
import { useKeystone } from '@keystone-6/core/admin-ui/context'

export function CustomNavigation({ authenticatedItem, lists }: NavigationProps) {
  const { endSession } = useKeystone()

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
          <button onClick={() => endSession?.()} aria-label="Sign out">
            Sign out
          </button>
        </div>
      </div>
    </NavigationContainer>
  )
}

