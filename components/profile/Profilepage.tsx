"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

import {
  Loader2,
  Trash2,
  X,
  AlertTriangle,
  Camera,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Gauge,
  Headphones
} from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Summary = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function ProfilePage(u: any) {
  const router = useRouter();
  const user = u.user;

  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState(user.picture || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [audioText, setAudioText] = useState("");
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/summary`, {
        headers: { "x-user-id": `${user.id}` },
      });
      const data = await res.json();
      setSummaries(data.summaries || []);
    } catch {
      toast.error("Failed to load summaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const handleBack = () => router.back();

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const handleImageSelect = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    setUploadingImage(true);

    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/profile/uploadprofile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, imageData: reader.result }),
        });

        const data = await res.json();

        if (res.ok) {
          setProfilePicture(data.imageUrl);
          toast.success("Profile updated");
        } else toast.error(data.error);
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setUploadingImage(false);
      }
    };
  };

  const handleDeleteClick = (summaryId: string) => setDeleteConfirmId(summaryId);

  const handleConfirmDelete = async (summaryId: string) => {
    setDeletingId(summaryId);

    const res = await fetch(`/api/user/summary?id=${summaryId}`, {
      method: "DELETE",
      headers: { "x-user-id": `${user.id}` },
    });

    if (res.ok) {
      toast.success("Summary deleted");
      if (selectedSummary?.id === summaryId) setSelectedSummary(null);
      fetchSummaries();
    } else toast.error("Delete failed");

    setDeletingId(null);
    setDeleteConfirmId(null);
  };

  const handleListen = (content: string) => {
    setAudioText(content);
    setShowAudioPlayer(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">

        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Tabs defaultValue="profile">

          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">

            <div className="flex items-center gap-6 mb-10">

              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                </Avatar>

                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                    <Loader2 className="animate-spin w-6 h-6 text-white" />
                  </div>
                )}

                <button
                  onClick={handleImageSelect}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full"
                >
                  <Camera className="text-white" />
                </button>

                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-muted-foreground">{user.role}</p>
              </div>

            </div>

            {loading && (
              <div className="flex gap-2 items-center">
                <Loader2 className="animate-spin w-5 h-5" />
                Loading summaries
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {summaries.map((summary) => (
                <Card key={summary.id}>
                  <CardContent className="p-6 space-y-3">

                    <h3 className="font-semibold">{summary.title}</h3>

                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {summary.content}
                    </p>

                    <div className="flex justify-between items-center">

                      <Button size="sm" onClick={() => setSelectedSummary(summary)}>View</Button>

                      <Button size="sm" variant="outline" onClick={() => handleListen(summary.content)}>
                        <Headphones className="w-4 h-4 mr-2" />
                        Listen
                      </Button>

                      <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(summary.id)}>
                        {deletingId === summary.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      </Button>

                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>

          </TabsContent>

          <TabsContent value="account">
            <Card className="max-w-xl">
              <CardContent className="p-6">
             
                <ChangePassword/>
                <div className="my-4 h-px w-full bg-gray-300"></div>
                <ChangeUsername userId={user.id} currentUsername={user.username} />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* SUMMARY MODAL */}
      {selectedSummary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">{selectedSummary.title}</h2>
                <p className="text-sm text-muted-foreground">{new Date(selectedSummary.createdAt).toLocaleDateString()}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedSummary(null)}> <X className="w-5 h-5" /> </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <p className="whitespace-pre-wrap">{selectedSummary.content}</p>
            </div>

            <div className="flex justify-between p-6 border-t">
              <Button variant="outline" onClick={() => handleListen(selectedSummary.content)}>
                <Headphones className="w-4 h-4 mr-2" /> Listen
              </Button>

              <Button variant="destructive" onClick={() => handleDeleteClick(selectedSummary.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-destructive" />
              <h3 className="font-semibold">Delete Summary</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this summary?
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleConfirmDelete(deleteConfirmId)}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIO PLAYER */}
      <AudioPlayer text={audioText} isVisible={showAudioPlayer} onClose={() => setShowAudioPlayer(false)} />

    </div>
  );
}

/* ================= AUDIO PLAYER ================= */
function AudioPlayer({ text, isVisible, onClose }: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const utteranceRef = useRef<any>(null);

  const startSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onend = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    setIsPlaying(true);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) stopSpeech();
    else startSpeech();
  };

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-center items-center gap-4">
      <Button size="icon" onClick={handlePlayPause}>{isPlaying ? <Pause /> : <Play />}</Button>
      <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
        {isMuted ? <VolumeX /> : <Volume2 />}
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setSpeed((s) => (s >= 2 ? 0.5 : s + 0.25))}><Gauge /></Button>
      <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
    </div>
  );
}

/* ------------------ CHANGE USERNAME ------------------ */
function ChangeUsername({ userId, currentUsername }: any) {
  const [username, setUsername] = useState(currentUsername);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleUpdate = async () => {
    if (!username.trim()) return toast.error("Username required");
    setLoading(true);
    const res = await fetch("/api/user/change-username", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, username }),
    });
    const data = await res.json();
    if (res.ok) { toast.success("Username updated"); router.refresh(); } else toast.error(data.error);
    setLoading(false);
  };
  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-xl font-semibold">Change Username</h2>
      <input className="w-full border rounded-md px-3 py-2" value={username} onChange={e => setUsername(e.target.value)} />
      <Button onClick={handleUpdate} disabled={loading}>{loading ? "Updating..." : "Update Username"}</Button>
    </div>
  );
}

/* ------------------ CHANGE PASSWORD ------------------ */
function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error("All fields required");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) { toast.success("Password updated"); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    else toast.error(data.error);
    setLoading(false);
  };

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold">Change Password</h2>
      <input type="password" placeholder="Current Password" className="w-full border rounded-md px-3 py-2" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
      <input type="password" placeholder="New Password" className="w-full border rounded-md px-3 py-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" className="w-full border rounded-md px-3 py-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      <Button onClick={handleUpdate} disabled={loading}>{loading ? "Updating..." : "Update Password"}</Button>
    </div>
  );
}