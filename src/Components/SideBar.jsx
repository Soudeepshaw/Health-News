import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../Context/DarkModeContext';
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import {
  NewspaperIcon,
  HeartIcon,
  SunIcon,
  MoonIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function SideBar() {
  const navigate = useNavigate();
  const [accordionOpen, setAccordionOpen] = useState(0);
  const { darkMode, toggleDarkMode } = useDarkMode();


  const handleTopicClick = (topic) => {
    navigate(`/?topic=${topic}`);

  };

  const handleAccordionOpen = (value) => {
    setAccordionOpen(accordionOpen === value ? 0 : value);
  };


  const SidebarContent = () => (
    <div className={`h-screen w-full md:w-64 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-100 to-white'} shadow-xl flex flex-col`}>
      <div className="p-4 mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <NewspaperIcon className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
          <Button
            variant="text"
            color={darkMode ? "white" : "blue-gray"}
            className="font-bold text-2xl"
            onClick={() => handleTopicClick('Health')}
          >
            Health News
          </Button>
        </div>
        <Button
          color={darkMode ? "blue" : "gray"}
          size="sm"
          className="rounded-full ml-auto"
          ripple
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
      <List className="space-y-2 p-2 flex-grow">
        <Accordion
          open={accordionOpen === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === 1 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className={`p-0 hover:${darkMode ? 'bg-gray-800' : 'bg-blue-gray-50'} rounded-lg transition-all duration-200`} selected={accordionOpen === 1}>
            <AccordionHeader onClick={() => handleAccordionOpen(1)} className="border-b-0 p-3">
              <ListItemPrefix>
                <HeartIcon className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </ListItemPrefix>
              <Typography color={darkMode ? "white" : "blue-gray"} className="mr-auto font-medium">
                Health Topics
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0 space-y-1">
              <ListItem 
                className={`hover:${darkMode ? 'bg-gray-800' : 'bg-blue-gray-50'} rounded-lg transition-all duration-200`}
                onClick={() => handleTopicClick('nutrition')}
              >
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className={`h-3 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </ListItemPrefix>
                Nutrition
              </ListItem>
              <ListItem 
                className={`hover:${darkMode ? 'bg-gray-800' : 'bg-blue-gray-50'} rounded-lg transition-all duration-200`}
                onClick={() => handleTopicClick('chronic-diseases')}
              >
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className={`h-3 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </ListItemPrefix>
                Chronic Diseases
              </ListItem>
              <ListItem 
                className={`hover:${darkMode ? 'bg-gray-800' : 'bg-blue-gray-50'} rounded-lg transition-all duration-200`}
                onClick={() => handleTopicClick('mental-health')}
              >
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className={`h-3 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </ListItemPrefix>
                Mental Health
              </ListItem>
              <ListItem 
                className={`hover:${darkMode ? 'bg-gray-800' : 'bg-blue-gray-50'} rounded-lg transition-all duration-200`}
                onClick={() => handleTopicClick('preventive-care')}
              >
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className={`h-3 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </ListItemPrefix>
                Preventive Care
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <ListItem 
          className={`hover:${darkMode ? 'bg-gray-800' : 'bg-blue-gray-50'} rounded-lg transition-all duration-200`} 
          onClick={() => handleTopicClick('bookmarks')} 
        >
          <ListItemPrefix>
            <BookmarkIcon className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </ListItemPrefix>
          Bookmarked Articles
        </ListItem>
        
      </List>
      <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-blue-gray-100'}`} />
      <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <Typography variant="small">
          © 2023 Health News. All rights reserved.
        </Typography>
        <Typography variant="small" className="mt-1">
          with Soudeep Shaw
        </Typography>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <SidebarContent />
      </div>
 
    </>
  );
}
