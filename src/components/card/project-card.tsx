"use client";
import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
  GitHubLogoIcon,
  ExternalLinkIcon,
  GlobeIcon,
  ArrowTopRightIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface ProjectCardProp {
  name: string;
  description: string;
  demoLink: string;
  img: string;
  sourceCode: string;
  language: string;
}
export function ProjectCard({ project }: { project: ProjectCardProp }) {
  return (
    <Card
      className="relative w-full flex flex-col top-0 shadow-lg transition-all duration-75 ease-in-out hover:-top-2 hover:shadow-xl"
    >
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>
            <Link
              className="hover:text-underline flex items-center leading-relaxed"
              target="_blank"
              href={project.demoLink}
            >
              {project.name}
              <ArrowTopRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button variant="secondary" className="px-3 shadow-none">
            <Link
              className="flex items-center"
              target="_blank"
              href={project.sourceCode}
            >
              <GitHubLogoIcon className="mr-2 h-4 w-4" />
              Code
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-[20px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="px-2 shadow-none">
                <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              alignOffset={-5}
              className="w-[200px]"
              forceMount
            >
              <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  className="flex items-center"
                  target="_blank"
                  href={project.demoLink}
                >
                  <ExternalLinkIcon className="mr-2 h-4 w-4" /> Live Demo
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className="flex items-center"
                  target="_blank"
                  href={project.sourceCode}
                >
                  <GitHubLogoIcon className="mr-2 h-4 w-4" /> Source Code
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 relative">
        <div className="flex justify-between absolute bottom-4 space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {project.language}
          </div>
          <div>Updated April 2023</div>
        </div>
      </CardContent>
    </Card>
  );
}
