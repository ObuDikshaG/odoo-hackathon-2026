"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, FolderTree, Activity } from "lucide-react";

import { DepartmentsTab } from "./departments-tab";
import { CategoriesTab } from "./categories-tab";
import { EmployeesTab } from "./employees-tab";

import { mockDepartments, mockCategories, mockEmployees, Department, AssetCategory, Employee } from "@/lib/data/mock";

export function OrganizationSetupClient() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [categories, setCategories] = useState<AssetCategory[]>(mockCategories);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const totalDepartments = departments.length;
  const activeDepartments = departments.filter((d) => d.status === "Active").length;
  const totalEmployees = employees.length;
  const totalCategories = categories.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Setup</h1>
        <p className="text-muted-foreground">
          Manage departments, asset categories, and the employee directory.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Departments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDepartments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asset Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="employees">Employee Directory</TabsTrigger>
        </TabsList>
        <TabsContent value="departments">
          <DepartmentsTab 
            departments={departments} 
            setDepartments={setDepartments} 
            employees={employees} 
          />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab 
            categories={categories} 
            setCategories={setCategories} 
          />
        </TabsContent>
        <TabsContent value="employees">
          <EmployeesTab 
            employees={employees} 
            setEmployees={setEmployees} 
            departments={departments} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
