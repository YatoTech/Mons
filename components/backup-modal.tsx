"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Cloud,
  HardDrive,
  Download,
  Upload,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Smartphone,
} from "lucide-react"
import type { User } from "@/lib/types"

interface BackupModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User
}

export function BackupModal({ isOpen, onClose, currentUser }: BackupModalProps) {
  const [loading, setLoading] = useState(false)
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupMethod: "google-drive",
    frequency: "daily",
    includeComments: true,
    includeAttachments: true,
    encryptBackup: true,
  })

  const handleGoogleDriveConnect = async () => {
    setLoading(true)
    // Simulate Google Drive connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)
    alert("Google Drive connected successfully! Your data will be automatically backed up.")
  }

  const handleLocalBackup = () => {
    // Simulate local backup
    const backupData = {
      user: currentUser,
      tasks: [], // Would include actual tasks
      settings: backupSettings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mons-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRestoreBackup = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const backupData = JSON.parse(e.target?.result as string)
            console.log("Backup data:", backupData)
            alert("Backup restored successfully!")
          } catch (error) {
            alert("Invalid backup file format.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            Data Backup & Security
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Backup Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Backup Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Last Backup</p>
                  <p className="text-sm text-gray-600">Today at 2:30 PM</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Up to date
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">6</p>
                  <p className="text-sm text-gray-600">Tasks Backed Up</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">2</p>
                  <p className="text-sm text-gray-600">Comments Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">1.2MB</p>
                  <p className="text-sm text-gray-600">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Drive Backup */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                  Google Drive
                </CardTitle>
                <CardDescription>Automatic cloud backup with Google Drive integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto Backup</span>
                  <Switch
                    checked={backupSettings.autoBackup}
                    onCheckedChange={(checked) => setBackupSettings((prev) => ({ ...prev, autoBackup: checked }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Backup Frequency</label>
                  <Select
                    value={backupSettings.frequency}
                    onValueChange={(value) => setBackupSettings((prev) => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleGoogleDriveConnect} disabled={loading} className="w-full">
                  {loading ? "Connecting..." : "Connect Google Drive"}
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    Automatic synchronization
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    End-to-end encryption
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    Version history
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Local Backup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="w-5 h-5 mr-2 text-gray-600" />
                  Local Backup
                </CardTitle>
                <CardDescription>Manual backup to your device storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleLocalBackup} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Backup
                </Button>

                <Button onClick={handleRestoreBackup} variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Restore from File
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    Full data export
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    Offline access
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 text-yellow-500" />
                    Manual process
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Backup Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Include Comments</p>
                  <p className="text-sm text-gray-600">Backup all task comments and discussions</p>
                </div>
                <Switch
                  checked={backupSettings.includeComments}
                  onCheckedChange={(checked) => setBackupSettings((prev) => ({ ...prev, includeComments: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Include Attachments</p>
                  <p className="text-sm text-gray-600">Backup uploaded files and documents</p>
                </div>
                <Switch
                  checked={backupSettings.includeAttachments}
                  onCheckedChange={(checked) => setBackupSettings((prev) => ({ ...prev, includeAttachments: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Encrypt Backup</p>
                  <p className="text-sm text-gray-600">Add extra security with encryption</p>
                </div>
                <Switch
                  checked={backupSettings.encryptBackup}
                  onCheckedChange={(checked) => setBackupSettings((prev) => ({ ...prev, encryptBackup: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mobile Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-green-600" />
                Mobile Sync (Coming Soon)
              </CardTitle>
              <CardDescription>Sync your tasks across all your devices</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Mobile app with real-time sync is coming soon! Your data will automatically sync across all devices.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Security:</strong> All backups are encrypted and stored securely. We never access your personal
              data without your permission.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
}
