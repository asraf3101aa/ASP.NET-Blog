import {
  BlogEndpointPaths,
  BlogModelsType,
  ReactionType,
} from "@/@enums/blog.enum";
import { BlogModels, BlogsList } from "@/@types/blog";
import { IFetchAPI } from "@/api/IFetchAPI";
import { ApiEndpointPaths } from "@/@enums/api.enum";
import { IBlogRepository } from "@/@types/repository";

export class BlogRepository implements IBlogRepository {
  private _fetchAPI: IFetchAPI;
  private _blogEndpointPath = ApiEndpointPaths.BLOG;
  constructor(fetchAPI: IFetchAPI) {
    this._fetchAPI = fetchAPI;
  }

  async getHomepageBlogs(sortBy: string, pageNumber: number) {
    return await this._fetchAPI.get<BlogModels[BlogModelsType.BLOGS_LIST]>(
      `${this._blogEndpointPath}/${BlogEndpointPaths.HOMEPAGE_BLOGS}/?sortBy=${sortBy}&pageNumber=${pageNumber}`,
      false
    );
  }

  async getBlogs(pageNumber: number): Promise<ApiResponse<BlogsList>> {
    return await this._fetchAPI.get<BlogModels[BlogModelsType.BLOGS_LIST]>(
      `${this._blogEndpointPath}?pageNumber=${pageNumber}`
    );
  }

  async createBlog(blogData: FormData) {
    return await this._fetchAPI.post<string, FormData>(
      this._blogEndpointPath,
      blogData
    );
  }

  async getBlogDetails(id: string) {
    return await this._fetchAPI.get<BlogModels[BlogModelsType.BLOG]>(
      `${this._blogEndpointPath}/${id}`
    );
  }

  async getCategories() {
    return await this._fetchAPI.get<BlogModels[BlogModelsType.CATEGORY][]>(
      `${this._blogEndpointPath}/${BlogEndpointPaths.CATEGORIES}`
    );
  }

  async updateBlog(id: string, updatedData: FormData) {
    return await this._fetchAPI.update<string, FormData>(
      `${this._blogEndpointPath}/${id}`,
      updatedData
    );
  }

  async deleteBlog(id: string) {
    return await this._fetchAPI.delete<string>(
      `${this._blogEndpointPath}/${id}`
    );
  }

  async reactOnBlog(id: string, reactionType: { reactionType: ReactionType }) {
    return await this._fetchAPI.post<string, { reactionType: ReactionType }>(
      `${this._blogEndpointPath}/${id}/${BlogEndpointPaths.REACTION}`,
      reactionType
    );
  }

  async commentOnBlog(id: string, text: string) {
    return await this._fetchAPI.post<string, { text: string }>(
      `${this._blogEndpointPath}/${id}/${BlogEndpointPaths.COMMENT}`,
      { text }
    );
  }

  async reactOnBlogComment(
    blogId: string,
    commentId: string,
    reactionType: { reactionType: ReactionType }
  ) {
    return await this._fetchAPI.post<string, { reactionType: ReactionType }>(
      `${this._blogEndpointPath}/${blogId}/${BlogEndpointPaths.COMMENT}/${commentId}/${BlogEndpointPaths.REACTION}`,
      reactionType
    );
  }
  async updateBlogComment(blogId: string, commentId: string, text: string) {
    return await this._fetchAPI.update<string, { text: string }>(
      `${this._blogEndpointPath}/${blogId}/${BlogEndpointPaths.COMMENT}/${commentId}`,
      { text }
    );
  }

  async deleteBlogComment(blogId: string, commentId: string) {
    return await this._fetchAPI.delete<string>(
      `${this._blogEndpointPath}/${blogId}/${BlogEndpointPaths.COMMENT}/${commentId}`
    );
  }
}
