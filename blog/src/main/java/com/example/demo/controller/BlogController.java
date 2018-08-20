package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.payload.*;
import com.example.demo.repository.BlogRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.BlogService;
import com.example.demo.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
	 	@Autowired
	    private BlogRepository blogRepository;

	    @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private BlogService blogService;

	    private static final Logger logger = LoggerFactory.getLogger(BlogController.class);

	    @GetMapping
	    public PagedResponse<BlogResponse> getBlogs(@CurrentUser UserPrincipal currentUser,
	                                                @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
	                                                @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
	        return blogService.getAllBlogs(currentUser, page, size);
	    }

	    @PostMapping
	    @PreAuthorize("hasRole('USER')")
	    public ResponseEntity<?> createPoll(@Valid @RequestBody BlogRequest blogRequest) {
	        Blog blog = blogService.createBlog(blogRequest);

	        URI location = ServletUriComponentsBuilder
	                .fromCurrentRequest().path("/{blogId}")
	                .buildAndExpand(blog.getId()).toUri();

	        return ResponseEntity.created(location)
	                .body(new ApiResponse(true, "Poll Created Successfully"));
	    }

	    @GetMapping("/{blogId}")
	    public BlogResponse getPollById(@CurrentUser UserPrincipal currentUser,
	                                    @PathVariable Long blogId) {
	        return blogService.getBlogById(blogId, currentUser);
	    }
	}
