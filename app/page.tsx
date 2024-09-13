"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

enum GenderType {
  Male = "male",
  WorkerMale = "workerMale",
  Female = "female",
}

interface RetirementInfo {
  originalRetirementAge: number;
  originalRetirementDate: Date;
  delayMonths: number;
  actualRetirementDate: Date;
  actualRetirementAge: number;
}

function calculateNewRetirement(
  birthDate: Date,
  gender: GenderType,
): RetirementInfo {
  const policyStartDate = new Date(2025, 0, 1); // 2025年1月1日
  const policyEndDate = new Date(2040, 0, 1); // 2040年1月1日

  let originalRetirementAge: number;
  let targetRetirementAge: number;

  // 确定原始退休年龄和目标退休年龄
  if (gender === GenderType.Female) {
    originalRetirementAge = 60;
    targetRetirementAge = 63;
  } else {
    if (gender === GenderType.WorkerMale) {
      originalRetirementAge = 50;
      targetRetirementAge = 55;
    } else {
      originalRetirementAge = 55;
      targetRetirementAge = 58;
    }
  }

  // 计算原定退休日期
  const originalRetirementDate = new Date(birthDate);
  originalRetirementDate.setFullYear(
    originalRetirementDate.getFullYear() + originalRetirementAge,
  );

  // 如果原定退休日期在政策实施前，不受影响
  if (originalRetirementDate < policyStartDate) {
    return {
      originalRetirementAge,
      originalRetirementDate,
      delayMonths: 0,
      actualRetirementDate: originalRetirementDate,
    };
  }

  // 计算延迟月数
  let delayMonths = 0;
  if (originalRetirementDate >= policyEndDate) {
    delayMonths = (targetRetirementAge - originalRetirementAge) * 12;
  } else {
    const totalMonthsInPolicy =
      (policyEndDate.getFullYear() - policyStartDate.getFullYear()) * 12;
    const monthsFromPolicyStart =
      (originalRetirementDate.getFullYear() - policyStartDate.getFullYear()) *
        12 +
      originalRetirementDate.getMonth() -
      policyStartDate.getMonth();
    const totalDelayMonths = (targetRetirementAge - originalRetirementAge) * 12;
    delayMonths = Math.floor(
      (monthsFromPolicyStart / totalMonthsInPolicy) * totalDelayMonths,
    );
  }

  // 计算实际退休日期
  const actualRetirementDate = new Date(originalRetirementDate);
  actualRetirementDate.setMonth(actualRetirementDate.getMonth() + delayMonths);

  // 计算实际退休年龄
  const actualRetirementAge = originalRetirementAge + delayMonths / 12;

  return {
    originalRetirementAge,
    originalRetirementDate,
    delayMonths,
    actualRetirementDate,
    actualRetirementAge,
  };
}

export default function Home() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [gender, setGender] = useState<GenderType>(GenderType.Male);

  const birthDate =
    year && month ? new Date(Number(year), Number(month) - 1) : null;
  const [retirementInfo, setRetirementInfo] = useState<RetirementInfo | null>(
    null,
  );

  const handleCalculate = () => {
    if (!birthDate) {
      return;
    }
    const info = calculateNewRetirement(birthDate, gender);
    setRetirementInfo(info);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 sm:px-6 lg:px-8">
      <Card className="md:w-[450px] ">
        <CardHeader>
          <CardTitle>延迟退休计算器</CardTitle>
          <CardDescription>
            输入出生年月和性别，即可计算出延迟退休的时间.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div>
                <label
                  htmlFor="year"
                  className="block mb-2 text-sm font-medium"
                >
                  出生年份
                </label>
                <Select onValueChange={setYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="请选择出生年份" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Month Selector */}
              <div>
                <label
                  htmlFor="month"
                  className="block mb-2 text-sm font-medium"
                >
                  出生月份
                </label>
                <Select onValueChange={setMonth}>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="请选择出生月份" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = i + 1;
                      return (
                        <SelectItem key={month} value={month.toString()}>
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">性别</Label>
                <Select onValueChange={(setValue) => setGender(setValue)}>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="请选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">男职工</SelectItem>
                    <SelectItem value="workerMale">
                      原定50周岁退休女职工
                    </SelectItem>
                    <SelectItem value="male">原定55周岁退休女职工</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>

          {retirementInfo && (
            <div className="mt-4">
              <p>原定退休年龄: {retirementInfo.originalRetirementAge} 岁</p>
              <p>实际退休年龄: {retirementInfo.actualRetirementAge} 岁</p>
              <p>延迟月数: {retirementInfo.delayMonths} 个月</p>
              <p>
                实际退休日期:{" "}
                {retirementInfo.actualRetirementDate.getFullYear()} 年
                {retirementInfo.actualRetirementDate.getMonth() + 1} 月
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleCalculate}>计算</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
