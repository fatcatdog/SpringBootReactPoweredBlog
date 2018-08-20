package com.example.demo.util;

import com.example.demo.model.Blog;
import com.example.demo.model.User;
import com.example.demo.payload.BlogResponse;
import com.example.demo.payload.UserSummary;

//import java.time.Instant;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;

public class ModelMapper {
	 public static BlogResponse mapBlogToBlogResponse(Blog blog, User creator) {
		 	BlogResponse blogResponse = new BlogResponse();
		 	blogResponse.setId(blog.getId());
		 	blogResponse.setTitle(blog.getTitle());
		 	blogResponse.setContent(blog.getContent());
		 	blogResponse.setCreationDateTime(blog.getCreatedAt());
//	        Instant now = Instant.now();

	        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
	        
	        blogResponse.setCreatedBy(creatorSummary);

	        return blogResponse;
	    }
}
