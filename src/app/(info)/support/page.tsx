import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function SupportPage() {
  return (
    <div>
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="mr-6 text-xl font-bold">
            Memora
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/eula"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              EULA
            </Link>
            <Link
              href="/support"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Support
            </Link>
            <Link
              href="/tos"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-6">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Memora Support</h1>
          <p className="text-muted-foreground">
            Need help with Memora? We're here to assist you with your Japanese
            learning journey.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="mb-2 font-semibold">Contact Information</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Get in touch with us directly for immediate assistance.
                </p>
                <div className="space-y-2 text-left text-sm">
                  <p>Email: memora.edu@gmail.com</p>
                  <p>Phone: +84 909 274 867</p>
                  <p>
                    Address: 100/65/20D, xã Đông Thạnh, huyện Hóc Môn, Tp. HCM,
                    Việt Nam
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="mb-2 font-semibold">App Features</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Learn about Memora's features for Japanese learning.
                </p>
                <ul className="space-y-1 text-left text-sm">
                  <li>• Flashcards</li>
                  <li>• Pronunciation Practice</li>
                  <li>• Listening Exercises</li>
                  <li>• Spaced Repetition</li>
                  <li>• Game Mode</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="mb-2 font-semibold">Memora Pro</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Premium features to enhance your learning experience.
                </p>
                <ul className="space-y-1 text-left text-sm">
                  <li>• AI-Generated Study Sets</li>
                  <li>• PDF Import with AI</li>
                  <li>• Advanced Statistics</li>
                  <li>• Priority Support</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="mb-2 font-semibold">Technical Information</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Technical details and documentation.
                </p>
                <Link href="/sbom" className="text-primary hover:underline">
                  View SBOM
                </Link>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="mb-16">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="mx-auto max-w-3xl">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How do I create a flashcard set?
              </AccordionTrigger>
              <AccordionContent>
                You can create a flashcard set by tapping the "+" button on the
                home screen, then entering your vocabulary words and their
                meanings. You can also import words from text or use our
                AI-powered auto-fill feature with Memora Pro.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                How do I practice pronunciation?
              </AccordionTrigger>
              <AccordionContent>
                Our pronunciation feature uses advanced speech recognition to
                help you perfect your Japanese pronunciation. Simply tap the
                microphone icon on any flashcard and speak the word to receive
                feedback.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                What is included in Memora Pro?
              </AccordionTrigger>
              <AccordionContent>
                Memora Pro includes AI-powered features like automatic study set
                generation, PDF import with AI analysis, advanced progress
                tracking, and priority support. Subscribe through the app to
                unlock all premium features.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Need More Help?</h2>
          <p className="mb-6 text-muted-foreground">
            Can't find what you're looking for? Contact our support team and
            we'll get back to you as soon as possible.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default">Contact Support</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Contact Support</AlertDialogTitle>
                <AlertDialogDescription>
                  Fill out the form below to send us an email.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form>
                <div style={{ marginBottom: "10px" }}>
                  <Input type="email" placeholder="Your Email" required />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <Input type="text" placeholder="Subject" required />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <textarea
                    placeholder="Your Message"
                    style={{ width: "100%", height: "100px" }}
                    required
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button type="submit" variant="default">
                      Send
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
