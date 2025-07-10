import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import Button from "./ui/button";

interface AuthGuardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthGuard({ open, onOpenChange }: AuthGuardProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Please sign in</AlertDialogTitle>
          <AlertDialogDescription>
            You need to sign in to add movies to your list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction>
             <SignInButton mode="modal">
             <Button
              //  variant="ghost"
               size="sm"
               className="text-white">
               Sign In
             </Button>
           </SignInButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
