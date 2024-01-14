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
import { cn } from "@/libs/utils";

interface ProjectCardProp {
  name: string;
  description: string;
  demoLink: string;
  img: string;
  sourceCode: string;
  language: string;
}
export function ProjectCard({ project }: { project: ProjectCardProp }) {
  const {sourceCode,language, name, demoLink, description} = project
  return (
    <Card className="relative top-0  flex w-full flex-col shadow-lg transition-all duration-75 ease-in-out hover:-top-2 hover:shadow-xl">
      <CardHeader className={cn(sourceCode && "grid grid-cols-[1fr_110px] items-start gap-4 space-y-0")}>
        <div className="space-y-1">
          <CardTitle className="my-0">
            <Link
              className="hover:text-underline flex items-center text-base leading-relaxed"
              target="_blank"
              href={demoLink}
            >
              {name}
              <ArrowTopRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {sourceCode && (
          <LinkDropDownButton links={project} />
        )}
      </CardHeader>
      <CardContent className="relative flex-1">
        <div className="absolute bottom-4 flex justify-between space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {language}
          </div>
          <div>Updated April 2023</div>
        </div>
      </CardContent>
    </Card>
  );
}


interface LinkListDropDownProp {
  demoLink: string;
  sourceCode: string;
}

const LinkDropDownButton = ({ links }:{links: LinkListDropDownProp}) => {
  
  const { sourceCode, demoLink } = links
  
  return (
    <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
            <Button variant="secondary" className="px-3 shadow-none">
              <Link
                className="flex items-center"
                target="_blank"
                href={sourceCode}
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
                    href={demoLink}
                  >
                    <ExternalLinkIcon className="mr-2 h-4 w-4" /> Live Demo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    className="flex items-center"
                    target="_blank"
                    href={sourceCode}
                  >
                    <GitHubLogoIcon className="mr-2 h-4 w-4" /> Source Code
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
  )
}