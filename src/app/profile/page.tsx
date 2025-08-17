"use client"

import { useUser } from "@/components/UserContext"
import Image from "next/image"
import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

type UserFieldType = {
  label: string
  field: keyof typeof defaultUser
  type?: "text" | "select"
  options?: string[]
}

const defaultUser = {
  id: "",
  name: "",
  email: "",
  role: "",
  affiliation: "",
  country: "",
  subscribed: true,
  avatar: ""
}

function FormField({
  label, type = "text", options, value, onChange, disabled, editMode, error
}: {
  label: string
  type?: "text" | "select"
  options?: string[]
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  editMode?: boolean
  error?: string
}) {
  return (
    <p className="w-full flex flex-col gap-1">
      <span className="flex items-center gap-2">
        <span className="font-semibold mr-2">{label}:</span>
        {!editMode ? (
          <span className="text-gray-700 dark:text-gray-300">{value || "-"}</span>
        ) : type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`border px-2 py-1 rounded w-full ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-transparent`}
          >
            {options?.map((opt) => (
              <option key={opt} value={opt} className="bg-white text-black dark:bg-white dark:text-black">
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`border px-2 py-1 rounded w-full ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-transparent`}
            placeholder=""
          />
        )}
      </span>
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </p>
  )
}

export default function Profile() {
  const { user, setUserAvatar, updateUserField } = useUser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [editedUser, setEditedUser] = useState({ ...user, subscribed: user.subscribed ?? true })
  const [tempAvatar, setTempAvatar] = useState(user.avatar)
  const [openAlert, setOpenAlert] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [errors, setErrors] = useState<{ [key in keyof typeof editedUser | "verificationCode"]?: string }>({})
  const [showVerificationInput, setShowVerificationInput] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [emailVerified, setEmailVerified] = useState(true)
  const [confirmSave, setConfirmSave] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { open, isMobile } = useSidebar()
  const paddingLeft = useMemo(() => (isMobile ? 0 : open ? 256 : 348), [isMobile, open])

  const userFields: UserFieldType[] = [
    { label: "ID", field: "id" },
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Role", field: "role", type: "select", options: ["Admin", "Editor", "Viewer"] },
    { label: "Affiliation", field: "affiliation" },
    { label: "Country", field: "country", type: "select", options: ["USA", "UK", "Germany", "Egypt", "India"] }
  ]

  useEffect(() => {
    const img = new window.Image()
    img.src = tempAvatar
    img.onload = () => setLoading(false)
  }, [tempAvatar])

  useEffect(() => {
    setEmailVerified((editedUser.email || "") === (user.email || ""))
  }, [editedUser.email, user.email])

  useEffect(() => {
    const changed = JSON.stringify({ ...user, subscribed: user.subscribed ?? true, avatar: user.avatar }) !== JSON.stringify({ ...editedUser, avatar: tempAvatar })
    setHasChanges(changed)
  }, [editedUser, tempAvatar, user])

  const handleButtonClick = () => fileInputRef.current?.click()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setTempAvatar(URL.createObjectURL(file))
  }

  const handleInputChange = (field: keyof typeof editedUser, value: string | boolean) =>
    setEditedUser((prev) => ({ ...prev, [field]: value }))

  const validateForm = () => {
    const newErrors: typeof errors = {}
    userFields.forEach(({ field, label }) => {
      if (editMode && field !== "id") {
        const val = editedUser[field as keyof typeof editedUser]?.toString().trim()
        if (!val) {
          newErrors[field as keyof typeof editedUser] = `${label} is required`
        }
      }
    })
    if (editMode && editedUser.email) {
      const emailVal = editedUser.email.trim()
      if (emailVal !== (user.email || "").trim() && !emailVerified) {
        newErrors.email = "You must verify your email before saving"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    setSaving(true)
    try {
      Object.keys(editedUser).forEach((key) => {
        const field = key as keyof typeof editedUser
        updateUserField(field, editedUser[field])
      })
      setUserAvatar(tempAvatar)
      toast.success("Profile updated successfully")
      setEditMode(false)
      setErrors({})
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedUser({ ...user, subscribed: user.subscribed ?? true })
    setTempAvatar(user.avatar)
    setEditMode(false)
    setErrors({})
    setShowVerificationInput(false)
    setVerificationCode("")
    setEmailVerified(true)
  }

  const handleCopyID = () => {
    navigator.clipboard.writeText(user.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerifyEmail = async () => {
    const newErrors: typeof errors = {}
    if ((editedUser.email || "").trim() === (user.email || "").trim()) {
      newErrors.email = "Email has not been changed"
    } else {
      const emailVal = editedUser.email.trim()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        newErrors.email = "Invalid email format"
      } else if (/[ء-ي]/.test(emailVal)) {
        newErrors.email = "Email cannot contain Arabic characters"
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }))
      return
    }
    setVerifying(true)
    await new Promise((res) => setTimeout(res, 1500))
    toast.success("Verification email sent")
    setVerifying(false)
    setShowVerificationInput(true)
  }

  const handleSendCode = () => {
    if (!verificationCode.trim()) {
      setErrors(prev => ({ ...prev, verificationCode: "Verification code is required" }))
      return
    }
    if (!/^\d+$/.test(verificationCode.trim())) {
      setErrors(prev => ({ ...prev, verificationCode: "Code must contain numbers only" }))
      return
    }
    toast.success(`Code ${verificationCode} sent`)
    setVerificationCode("")
    setShowVerificationInput(false)
    setErrors(prev => ({ ...prev, verificationCode: "" }))
    setEmailVerified(true)
  }

  const handleMouseEnter = () => {
    if (editMode) {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 700)
    }
  }

  return (
    <div className="grid gap-4 transition-all duration-300" style={{ paddingLeft }}>
      <div className="dark:border-gray-600 rounded-lg w-[400px] h-[580px] p-4 flex flex-col items-center relative transition-all duration-300" style={{ transform: editMode ? "translateY(-40px)" : "translateY(0)" }}>
        {!editMode && (
          <Button onClick={() => { setEditedUser({ ...user, subscribed: user.subscribed ?? true }); setTempAvatar(user.avatar); setEditMode(true) }} className="absolute top-4 right-4 z-10 bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 active:scale-95">Edit</Button>
        )}

        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

        {loading ? (
          <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4" />
        ) : (
          <div className="flex flex-col items-center gap-6 mt-2 w-full px-4 text-sm text-black dark:text-gray-300">
            <div className="relative flex flex-col items-center" onMouseEnter={handleMouseEnter}>
              <div className={`h-32 w-32 rounded-full overflow-hidden ring-2 ring-gray-300 dark:ring-gray-600 ${editMode ? "cursor-pointer" : "cursor-default"}`} onClick={editMode ? handleButtonClick : undefined}>
                <Image src={tempAvatar} alt={user.name} width={128} height={128} className="object-cover w-full h-full" />
              </div>
              {editMode && (
                <div className="absolute bottom-1 right-1 group">
                  <button onClick={handleButtonClick} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 p-1 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-900 active:scale-95 cursor-pointer relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6 3.536 3.536a2.5 2.5 0 01-3.536 3.536L9 13zm0 0L4 18v2h2l5-5z" />
                    </svg>
                  </button>
                  {showTooltip && (
                    <span className="absolute bottom-full mb-1 right-1/2 translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                      Change picture
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              {userFields.map(({ label, field, type, options }) => {
                if (editMode && field === "id") return null
                return (
                  <div key={field} className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2">
                      <FormField
                        label={label}
                        type={type}
                        options={options}
                        value={editedUser[field as keyof typeof editedUser] as string}
                        onChange={(val) => {
                          handleInputChange(field as keyof typeof editedUser, val)
                          setErrors(prev => ({ ...prev, [field]: "" }))
                        }}
                        disabled={!editMode}
                        editMode={editMode}
                        error={errors[field as keyof typeof editedUser]}
                      />
                      {field === "id" && !editMode && (
                        <button onClick={handleCopyID} className="ml-2 flex items-center gap-1 text-gray-500 hover:text-black dark:hover:text-white">
                          {copied ? (<><Check size={16} /><span className="text-xs">Copied</span></>) : (<><Copy size={16} /><span className="text-xs">Copy</span></>)}
                        </button>
                      )}
                      {field === "email" && editMode && editedUser.email !== user.email && (
                        <Button onClick={handleVerifyEmail} disabled={verifying} className="h-[34px] bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 active:scale-95">
                          {verifying ? "Verifying..." : "Verify Email"}
                        </Button>
                      )}
                    </div>
                    {field === "email" && editMode && showVerificationInput && (
                      <div className="flex flex-col mt-2 w-[220px]">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className={`border px-2 py-1 rounded w-full ${errors.verificationCode ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-transparent`}
                            placeholder="Enter code"
                          />
                          <Button onClick={handleSendCode} className="bg-white text-black dark:bg-black dark:text-white border hover:bg-green-600 dark:hover:bg-green-600 hover:text-white">
                            Send
                          </Button>
                        </div>
                        {errors.verificationCode && (
                          <span className="text-red-500 text-xs mt-1">{errors.verificationCode}</span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <label className="flex items-center mt-2 cursor-pointer select-none w-full">
              <Checkbox
                checked={editedUser.subscribed}
                onCheckedChange={(checked) => handleInputChange("subscribed", Boolean(checked))}
                className="mr-2"
                disabled={!editMode}
              />
              <span>Subscribe</span>
            </label>

            <div className="w-full flex justify-end mt-3 gap-2">
              {editMode ? (
                <>
                  <Button onClick={handleCancel} className="bg-white text-black dark:bg-black dark:text-white border hover:bg-red-600 dark:hover:bg-red-600 hover:text-white">Cancel</Button>
                  <AlertDialog open={confirmSave} onOpenChange={setConfirmSave}>
                    <AlertDialogTrigger asChild>
                      <Button disabled={saving || !hasChanges} className={`bg-white text-black dark:bg-black dark:text-white border ${hasChanges ? "hover:bg-green-600 dark:hover:bg-green-600 hover:text-white" : "opacity-50 cursor-not-allowed"}`}>
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to save these changes?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel autoFocus className="bg-white text-black dark:bg-black dark:text-white border hover:bg-red-600 dark:hover:bg-red-600 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSave} className="bg-white text-black dark:bg-black dark:text-white border hover:bg-green-600 dark:hover:bg-green-600 hover:text-white">Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-red-600 dark:hover:bg-red-600 hover:text-white">Delete my account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Warning</AlertDialogTitle>
                      <AlertDialogDescription>You are about to delete your account.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel autoFocus className="bg-white text-black dark:bg-black dark:text-white border hover:bg-gray-200 dark:hover:bg-gray-800">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}