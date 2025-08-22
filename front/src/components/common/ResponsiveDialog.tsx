import { useMediaQuery } from "~/hooks/useGetScreenWidth";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import React from "react";

type incomingProps = {
  title: string | null;
  description: string | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

export function ResponsiveDialog({
  title,
  description,
  isOpen,
  setIsOpen,
  children,
}: incomingProps) {
  const isLargeScreen = useMediaQuery("(min-width: 512px)");

  if (!isLargeScreen) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            {title && (
              <DrawerTitle className="!text-black">{title}</DrawerTitle>
            )}
            {description && (
              <DrawerDescription className="!text-black!">
                {description}
              </DrawerDescription>
            )}
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
          {children}
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
}
