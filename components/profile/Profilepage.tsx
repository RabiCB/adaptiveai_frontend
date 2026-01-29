"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, FileText, ChevronLeft, ChevronRight, Trash2, X, AlertTriangle, Camera, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Summary = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type Pagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function ProfilePage(u: any) {
  const router = useRouter();
   const user=u.user
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user.picture || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

 

  const fetchSummaries = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/summary?page=${page}`, {
        method: "GET",
        headers: {
          "x-user-id": `${user.id}`,
        }
      });

      const data = await res.json();
      setSummaries(data.summaries || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load summaries");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        // Upload to Cloudinary via API
        const res = await fetch("/api/profile/uploadprofile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            imageData: base64Data,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setProfilePicture(data.imageUrl);
          toast.success("Profile picture updated successfully!");
        } else {
          toast.error(data.error || "Failed to upload image");
        }
        setUploadingImage(false);
      };
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while uploading");
      setUploadingImage(false);
    }
  };

  const handleDeleteClick = (summaryId: string) => {
    setDeleteConfirmId(summaryId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleConfirmDelete = async (summaryId: string) => {
    setDeletingId(summaryId);
    setDeleteConfirmId(null);
    
    try {
      const res = await fetch(`/api/user/summary?id=${summaryId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": `${user.id}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Summary deleted successfully");
        if (selectedSummary?.id === summaryId) {
          setSelectedSummary(null);
        }
        fetchSummaries(currentPage);
      } else {
        toast.error(data.error || "Failed to delete summary");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewSummary = (summary: Summary) => {
    setSelectedSummary(summary);
  };

  const handleCloseModal = () => {
    setSelectedSummary(null);
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    fetchSummaries(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (deleteConfirmId) {
          handleCancelDelete();
        } else if (selectedSummary) {
          handleCloseModal();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    
    if (selectedSummary || deleteConfirmId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedSummary, deleteConfirmId]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2 hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
          {/* Avatar with Upload Button */}
          <div className="relative group">
            <Avatar className="h-24 w-24 border-2 border-primary/20">
              <AvatarImage src={profilePicture || "/placeholder.svg"} alt={user.username} />
              <AvatarFallback className="text-2xl bg-secondary text-foreground">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            
            {/* Upload Button Overlay */}
            <button
              onClick={handleImageSelect}
              disabled={uploadingImage}
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-0"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {user.username}
            </h1>
            <p className="text-primary font-medium">{user.role || "User"}</p>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              View and manage your saved summaries. All your AI-generated content in one place.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImageSelect}
              disabled={uploadingImage}
              className="gap-2 mt-2"
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Change Photo
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Saved Summaries</h2>
            {pagination && (
              <p className="text-sm text-muted-foreground mt-1">
                {pagination.total} {pagination.total === 1 ? "summary" : "summaries"} total
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 text-muted-foreground py-20">
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Loading summaries...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && summaries.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No saved summaries yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Start summarizing content and save your results to see them here.
            </p>
          </div>
        )}

        {/* Summaries Grid */}
        {!loading && summaries.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {summaries.map((summary) => (
                <Card
                  key={summary.id}
                  className="bg-card border-border hover:border-primary/30 transition-all duration-200 group"
                >
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {summary.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                      {summary.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {new Date(summary.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewSummary(summary)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(summary.id)}
                          disabled={deletingId === summary.id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deletingId === summary.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-border hover:bg-secondary hover:text-foreground disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1 mx-4">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          pageNum === currentPage
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="border-border hover:bg-secondary hover:text-foreground disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Loading Overlay */}
      {uploadingImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background border border-border rounded-lg shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[300px]">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <Upload className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Uploading Profile Picture</h3>
              <p className="text-sm text-muted-foreground">Please wait while we update your profile...</p>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: "70%" }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Modal */}
      {selectedSummary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex-1 pr-8">
                <h2 className="text-2xl font-bold text-foreground line-clamp-1">
                  {selectedSummary.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(selectedSummary.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                className="hover:bg-secondary shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedSummary.content}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                  className="border-border hover:bg-background"
                >
                  Close
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(selectedSummary.id)}
                disabled={deletingId === selectedSummary.id}
                className="gap-2"
              >
                {deletingId === selectedSummary.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popover */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Delete Summary</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this summary? This will permanently remove it from your account.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelDelete}
                className="border-border hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleConfirmDelete(deleteConfirmId)}
                disabled={deletingId === deleteConfirmId}
                className="gap-2"
              >
                {deletingId === deleteConfirmId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}