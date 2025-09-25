"use client";
import type { Dispatch, SetStateAction } from "react";
import type { TListCourseSelected } from "../registration-course";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type Props = {
  courseSelected: TListCourseSelected;
  dialogState: boolean;
  openDialog: Dispatch<SetStateAction<boolean>>;
  submitCreateRegistrationCourse: () => void;
};

export type SelectCourse = {
  courseId: number;
  sectionId: number;
};

export default function ShowCourseSelected(props: Readonly<Props>) {
  const {
    courseSelected,
    dialogState,
    openDialog,
    submitCreateRegistrationCourse,
  } = props;

  return (
    <AlertDialog open={dialogState} onOpenChange={openDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณต้องการลงทะเบียนรายวิชา</AlertDialogTitle>
          <AlertDialogDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ไอดี</TableHead>
                  <TableHead>ชื่อรายวิชา</TableHead>
                  <TableHead>section ที่เลือก</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseSelected.map((item, index) => {
                  if (item === null) {
                    return null;
                  }
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.course.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.course.name}
                      </TableCell>
                      <TableCell>{item.section.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={submitCreateRegistrationCourse}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}