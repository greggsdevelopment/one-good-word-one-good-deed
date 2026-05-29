import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut, Mail, MessageSquare, BookOpen, Check, X, Trash2 } from 'lucide-react';

export default function Admin() {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['contactMessages'],
    queryFn: () => base44.entities.ContactMessage.list('-created_date', 100),
  });

  const { data: pledges = [], isLoading: loadingPledges } = useQuery({
    queryKey: ['pledges'],
    queryFn: () => base44.entities.Pledge.list('-created_date', 100),
  });

  const { data: stories = [], isLoading: loadingStories } = useQuery({
    queryKey: ['stories'],
    queryFn: () => base44.entities.Story.list('-created_date', 100),
  });

  const approveStory = useMutation({
    mutationFn: ({ id, approved }) => base44.entities.Story.update(id, { approved }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stories'] }),
  });

  const deleteRecord = useMutation({
    mutationFn: ({ entity, id }) => base44.entities[entity].delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink text-cream p-4 sm:p-6 flex items-center justify-between">
        <div>
          <h1 className="font-anton text-2xl sm:text-3xl">ADMIN DASHBOARD</h1>
          <p className="font-barlow text-cream/50 text-sm">One Good Word...One Good Deed</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="font-barlow-condensed text-cream/50 hover:text-gold text-sm tracking-wider uppercase transition-colors">
            View Site
          </a>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-cream border-cream/20 hover:bg-cream/10">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-sm p-5 border border-ink/5">
            <p className="font-anton text-3xl text-ink">{pledges.length}</p>
            <p className="font-barlow text-ash text-sm">Total Pledges</p>
          </div>
          <div className="bg-white rounded-sm p-5 border border-ink/5">
            <p className="font-anton text-3xl text-ink">{messages.length}</p>
            <p className="font-barlow text-ash text-sm">Messages</p>
          </div>
          <div className="bg-white rounded-sm p-5 border border-ink/5">
            <p className="font-anton text-3xl text-ink">{stories.length}</p>
            <p className="font-barlow text-ash text-sm">Stories</p>
          </div>
        </div>

        <Tabs defaultValue="messages">
          <TabsList className="bg-white border border-ink/5 mb-6">
            <TabsTrigger value="messages" className="font-barlow-condensed uppercase tracking-wider text-xs">
              <Mail className="w-4 h-4 mr-1.5" /> Messages
            </TabsTrigger>
            <TabsTrigger value="pledges" className="font-barlow-condensed uppercase tracking-wider text-xs">
              <MessageSquare className="w-4 h-4 mr-1.5" /> Pledges
            </TabsTrigger>
            <TabsTrigger value="stories" className="font-barlow-condensed uppercase tracking-wider text-xs">
              <BookOpen className="w-4 h-4 mr-1.5" /> Stories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <div className="space-y-3">
              {loadingMessages && <p className="font-barlow text-ash">Loading...</p>}
              {messages.map((msg) => (
                <div key={msg.id} className="bg-white rounded-sm p-5 border border-ink/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-barlow font-semibold text-ink">{msg.name}</p>
                        <p className="font-barlow text-ash text-sm">{msg.email}</p>
                      </div>
                      <p className="font-barlow-condensed text-ink/70 text-sm uppercase tracking-wider mb-1">{msg.subject}</p>
                      <p className="font-barlow text-ink/60 text-sm leading-relaxed">{msg.message}</p>
                      <p className="font-barlow text-ash text-xs mt-2">{new Date(msg.created_date).toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRecord.mutate({ entity: 'ContactMessage', id: msg.id })}
                      className="text-ash hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!loadingMessages && messages.length === 0 && (
                <p className="font-barlow text-ash text-center py-8">No messages yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pledges">
            <div className="space-y-2">
              {loadingPledges && <p className="font-barlow text-ash">Loading...</p>}
              {pledges.map((pledge) => (
                <div key={pledge.id} className="bg-white rounded-sm p-4 border border-ink/5 flex items-center justify-between">
                  <div>
                    <span className="font-barlow font-semibold text-ink">{pledge.name}</span>
                    {pledge.location && <span className="font-barlow text-ash text-sm ml-2">from {pledge.location}</span>}
                    {pledge.message && <p className="font-barlow text-ink/50 text-sm mt-1">"{pledge.message}"</p>}
                    <p className="font-barlow text-ash text-xs mt-1">{new Date(pledge.created_date).toLocaleString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRecord.mutate({ entity: 'Pledge', id: pledge.id })}
                    className="text-ash hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {!loadingPledges && pledges.length === 0 && (
                <p className="font-barlow text-ash text-center py-8">No pledges yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stories">
            <div className="space-y-3">
              {loadingStories && <p className="font-barlow text-ash">Loading...</p>}
              {stories.map((story) => (
                <div key={story.id} className="bg-white rounded-sm p-5 border border-ink/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-barlow font-semibold text-ink">{story.name}</p>
                        {story.location && <p className="font-barlow text-ash text-sm">{story.location}</p>}
                        <Badge variant={story.approved ? 'default' : 'secondary'} className="text-xs">
                          {story.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="font-barlow text-ink/60 text-sm leading-relaxed">{story.story}</p>
                      <p className="font-barlow text-ash text-xs mt-2">{new Date(story.created_date).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => approveStory.mutate({ id: story.id, approved: !story.approved })}
                        className={story.approved ? 'text-ash hover:text-red-500' : 'text-ash hover:text-green-600'}
                      >
                        {story.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRecord.mutate({ entity: 'Story', id: story.id })}
                        className="text-ash hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {!loadingStories && stories.length === 0 && (
                <p className="font-barlow text-ash text-center py-8">No stories yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}