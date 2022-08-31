import type { NextPage } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  Dropdown,
  Menu,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IPostBlog } from '../interface/blog';
import { postBlog } from '../api/blog';
import {
  openErrorNotification,
  openSuccessNotification,
} from '../utils/openNotification';
import IMessage from '../interface/message';

const Create: NextPage = () => {
  const editorRef = useRef<any>();

  const [form] = Form.useForm();

  const { Option } = Select;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const fileUploadOptions = {
    maxCount: 1,
    multiple: false,
    showUploadList: true,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error(`${file.name} is not an image file`);
        return isImage || Upload.LIST_IGNORE;
      }
      if (file) setSelectedImage(file);
      return false;
    },
    onRemove: () => setSelectedImage(null),
  };

  const handlePostBlog = useMutation(
    (formValues: IPostBlog | any) => {
      // * avoid append if formvalue is empty
      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
        // * if form value is an array
        if (Array.isArray(formValues[key])) {
          formValues[key].forEach((value: string) => {
            if (value) formData.append(key, value);
          });
          return;
        }
        if (formValues[key]) formData.append(key, formValues[key]);
      });
      if (selectedImage) formData.append('image', selectedImage);

      return postBlog(formData);
    },
    {
      onSuccess: (res: IMessage) => {
        openSuccessNotification(res.message);
        form.resetFields();
      },
      onError: (err: any) => openErrorNotification(err.response.data.message),
    }
  );

  return (
    <div className='w-full flex flex-col items-center p-5'>
      <Head>
        <title>Create a post</title>
        <link href='/favicon.ico' rel='icon' />
      </Head>

      <main className='xl:w-3/4 w-full'>
        <Form
          autoComplete='off'
          className='w-full grid grid-cols-4'
          form={form}
          initialValues={{ remember: true }}
          layout='vertical'
          name='basic'
          requiredMark={false}
        >
          <Form.Item
            className='col-span-full'
            name='title'
            rules={[{ required: true, message: 'Please input title' }]}
          >
            <Input
              className='rounded-lg px-4 py-2.5 placeholder:text-base'
              placeholder='Title'
            />
          </Form.Item>

          <Form.Item className='col-span-full'>
            <Editor
              apiKey='bzuei2kyl5e5z8ryogjw5qq9ue6wfqj2qarzvlto5orm8pfd'
              init={{
                height: 415,
                menubar: true,
                plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'preview',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'code',
                  'help',
                  'wordcount',
                ],
                toolbar:
                  'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
              initialValue='<p>This is the initial content of the editor.</p>'
              onInit={(evt, editor) => (editorRef.current = editor)}
            />
          </Form.Item>

          <Form.Item className='w-fit'>
            <Upload {...fileUploadOptions}>
              <Button
                className='rounded-lg flex items-center py-[1.23rem] md:text-sm text-xs'
                icon={<UploadOutlined className='text-lg' />}
              >
                Upload Blog Cover
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            className='col-span-3 md:w-full w-4/6 justify-self-end'
            name='genre'
            rules={[
              {
                required: true,
                message: 'Please select atleast a genre',
              },
              {
                validator: (_, value) => {
                  if (value.length > 5) {
                    return Promise.reject('Max 5 genre allowed.');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Select
              className='w-full rounded-lg'
              mode='multiple'
              placeholder='Select genre (max 5)'
              size='large'
              allowClear
            >
              <Option value='brand'>Brand</Option>
              <Option value='category'>Category</Option>
              <Option value='product_goup'>Product Group</Option>
              <Option value='brand'>Brand</Option>
              <Option value='categry'>Category</Option>
              <Option value='product_group'>Product Group</Option>
            </Select>
          </Form.Item>

          <Form.Item className='col-span-full w-fit flex items-center bg-[#021431] min-h-[2.6rem] h-[2.6rem] px-3 rounded-full'>
            <Button
              className='btn min-h-full h-auto focus:bg-inherit focus:border-[#021431]'
              loading={handlePostBlog.isLoading}
              onClick={() =>
                form.validateFields().then((values) =>
                  handlePostBlog.mutate({
                    ...values,
                    isPublished: true,
                    content:
                      editorRef.current && editorRef.current.getContent(),
                  })
                )
              }
            >
              Save & Publish
            </Button>

            <span className='text-white pr-3'>|</span>

            <Dropdown
              className='text-[#99C6FF] text-base cursor-pointer rotate-45'
              overlay={
                <Menu
                  items={[
                    {
                      label: (
                        <span
                          onClick={() =>
                            form.validateFields().then((values) =>
                              handlePostBlog.mutate({
                                ...values,
                                content:
                                  editorRef.current &&
                                  editorRef.current.getContent(),
                              })
                            )
                          }
                        >
                          Save to Draft
                        </span>
                      ),
                      key: 0,
                    },
                  ]}
                />
              }
            >
              <span className='rotate-45'>{'>'}</span>
            </Dropdown>
          </Form.Item>
        </Form>
      </main>
    </div>
  );
};

export default Create;
