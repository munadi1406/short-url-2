'use client'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function FormCreate() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        mode: 'single',
    });

    const handleIsOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleModeChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            mode: value,
        }));
    };
    const { mutate, isPending } = useMutation({
        mutationFn: async (e) => {
            e.preventDefault()
            const createLink = await axios.post('/api/shorten', formData)
            return createLink
        }
    })


    return (
        <>
            <Button onClick={handleIsOpen}>Create Link</Button>
            <Drawer open={isOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Create Link</DrawerTitle>
                        <DrawerDescription>Masukkan Title Link</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-2 w-full ">
                        <form
                            className="border border-gray-200 rounded-md p-4 flex gap-2 flex-col"
                            onSubmit={mutate}
                        >

                            <Tabs
                                defaultValue="single"
                                className="w-full"
                                onValueChange={handleModeChange}
                            >
                                <TabsList>
                                    <TabsTrigger value="single">Single Link</TabsTrigger>
                                    <TabsTrigger value="bulk">Bulk Link</TabsTrigger>
                                </TabsList>
                                <TabsContent value="single">
                                    <div>
                                        <Label htmlFor="link">Link</Label>
                                        <Input
                                            name="link"
                                            id="link"
                                            required={formData.mode === 'single'}
                                            placeholder="Masukkan Link"
                                            value={formData.link}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="bulk" className="max-h-[50vh] p-2 overflow-auto flex flex-col gap-2">
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            name="title"
                                            id="title"
                                            required
                                            placeholder="Masukkan title"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>

                                    <Label htmlFor="bulkLinks">Bulk Link</Label>
                                    <Textarea
                                        id="bulkLinks"
                                        name="link"
                                        placeholder="Masukkan beberapa link (satu per baris)"
                                        value={formData.link}
                                        onChange={handleChange}
                                        />
                                        </div>
                                </TabsContent>
                            </Tabs>
                            <DrawerFooter className="p-0">
                                <Button type="submit" disabled={isPending}>Submit</Button>
                                <DrawerClose asChild>
                                    <Button onClick={handleIsOpen} variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
