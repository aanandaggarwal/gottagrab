'use client'

import { useEffect, useState } from 'react'
import { supabase }          from '@/lib/supabase'
import Header               from '@/components/Header'
import AuthModal            from '@/components/AuthModal'
import ListsManager         from '@/components/ListsManager'
import ShoppingList         from '@/components/ShoppingList'
import PendingInvites       from '@/components/PendingInvites'

// Mirror the columns of view_pending_invites:
type Invite = {
  id:               string
  list_id:          string
  invitee_email:    string
  invited_by:       string
  invited_by_email: string
  list_name:        string
  list_icon:        string
  list_color:       string
}

export default function HomePage() {
  const [session, setSession]             = useState<any>(null)
  const [loading, setLoading]             = useState(true)
  const [selectedList, setSelectedList]   = useState<any>(null)
  const [invites, setInvites]             = useState<Invite[]>([])
  const [refreshListsFlag, setRefreshListsFlag] = useState(0)

  // 1) Auth/session setup
  useEffect(() => {
    supabase.auth.getSession().then(({ data:{ session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // 2) Fetch from new view
  useEffect(() => {
    if (!session) return
    supabase
    .from('view_pending_invites')
    .select('*')
      .eq('invitee_email', session.user.email)
      .then(({ data, error }) => {
        if (error) console.error(error.message)
        else setInvites(data || [])
      })
  }, [session, refreshListsFlag])

  // Accept / decline via RLS RPCs
  const accept = async (id: string) => {
    await supabase.rpc('accept_invite', { p_invite_id: id })
    setRefreshListsFlag((f) => f + 1)
  }
  const decline = async (id: string) => {
    await supabase.rpc('decline_invite', { p_invite_id: id })
    setRefreshListsFlag((f) => f + 1)
  }

  if (loading) return null
  if (!session) return <AuthModal />

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
            setRefreshFlag={setRefreshListsFlag}
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
