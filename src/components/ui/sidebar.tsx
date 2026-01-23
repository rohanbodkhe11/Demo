
"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'

type SidebarContextProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a <SidebarProvider />")
  }

  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen, setIsOpen } = React.useContext(SidebarContext) as SidebarContextProps
  const panelRef = React.useRef<HTMLDivElement | null>(null)

  // Focus trap & escape
  React.useEffect(() => {
    if (!isOpen || !panelRef.current) return

    const container = panelRef.current
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }
      if (e.key !== 'Tab') return

      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    // focus first element for keyboard users
    setTimeout(() => first?.focus())
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, setIsOpen])

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const panelVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%' },
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div
        ref={ref}
        className={cn(
          "hidden lg:flex h-screen w-64 border-r bg-background flex-col",
          className
        )}
        {...props}
      />

      {/* Mobile drawer / overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial="hidden" animate="visible" exit="hidden">
            <motion.div
              className="absolute inset-0 bg-black/40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.22 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="absolute left-0 top-0 bottom-0 w-72 bg-background shadow-lg"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div ref={panelRef} className={cn('h-full flex flex-col')} aria-hidden={!isOpen}>
                {props.children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-16 shrink-0", className)} {...props} />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-grow overflow-y-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex shrink-0 flex-col gap-2", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return <ul ref={ref} className={cn("space-y-1", className)} {...props} />
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return <li ref={ref} className={cn("", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

export const sidebarMenuButtonVariants = cva(
  "inline-flex w-full items-center justify-start gap-2 whitespace-nowrap rounded-md p-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      isActive: {
        true: "bg-primary text-primary-foreground",
        false: "hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }
>(({ className, isActive, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(sidebarMenuButtonVariants({ isActive, className }))}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

function SidebarToggle({ className }: { className?: string }) {
  const { isOpen, setIsOpen } = useSidebar()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("lg:hidden", className)}
      onClick={() => setIsOpen(!isOpen)}
      aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      aria-expanded={isOpen}
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarToggle,
}
