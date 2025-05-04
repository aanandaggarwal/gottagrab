'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import AuthModal from '@/components/AuthModal'
import ListsManager from '@/components/ListsManager'
import ShoppingList from '@/components/ShoppingList'
import PendingInvites from '@/components/PendingInvites'

// include both icon & color now:
export type List = {
  id: string
  name: string
  owner_id: string
  icon: string
  icon_color: string
}

type Invite = {
  id: string
  list_id: string
  invited_by: string
  list: { name: string }[]
}

export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedList, setSelectedList] = useState<List | null>(null)
  const [invites, setInvites] = useState<Invite[]>([])
  const [refreshListsFlag, setRefreshListsFlag] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    supabase
      .from('list_invites')
      .select('id, list_id, invited_by, list:lists(name)')
      .eq('email', session.user.email)
      .then(({ data, error }) => {
        if (error) console.error(error.message)
        else setInvites(data as Invite[])
      })
  }, [session, refreshListsFlag])

  if (loading) return null
  if (!session) return <AuthModal />

  const accept = async (id: string) => {
    await supabase.rpc('accept_invite', { p_invite_id: id })
    setInvites((i) => i.filter((x) => x.id !== id))
    setRefreshListsFlag((f) => f + 1)
  }
  const decline = async (id: string) => {
    await supabase.rpc('decline_invite', { p_invite_id: id })
    setInvites((i) => i.filter((x) => x.id !== id))
    setRefreshListsFlag((f) => f + 1)
  }

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto p-4">
        {invites.length > 0 && (
          <PendingInvites
            invites={invites}
            onAccept={accept}
            onDecline={decline}
          />
        )}

        {!selectedList ? (
          <ListsManager
            user={session.user}
            onSelect={setSelectedList}
            refreshFlag={refreshListsFlag}
          />
        ) : (
          <ShoppingList
            user={session.user}
            list={selectedList}
            onBack={() => setSelectedList(null)}
          />
        )}
      </main>
    </>
  )
}
